"option strict";
var fs = require('fs'),
    iconv = require('iconv-lite');

// cedict.script is downloaded from:
// https://sourceforge.net/p/zdt/svn/HEAD/tree/trunk/net.sourceforge.zdt.cedict/cedict.script
// sorted.txt is copied and pasted from (be careful of encoding issues)
// http://technology.chtsai.org/charfreq/sorted.html
// phrases.bg5 is downloaded as phrasesb5.zip from:
// http://technology.chtsai.org/wordlist/
var rankBoundaries = [200, 500, 1000, 5000],
    maxRank = rankBoundaries[rankBoundaries.length-1],
    frequencies = fs.readFileSync('sorted.txt', {encoding: 'utf-8'}),
    freqRegex = /^(\S)\s+\d+\s+\d+$/gm,
    result,
    topCharacters = [],
    manualOverrides = {
        '子': 'zi5',
        '去': 'qu4',
        '結': 'jie2'
    };

while ((result = freqRegex.exec(frequencies)) && topCharacters.length <= maxRank) {
    topCharacters.push(result[1]);
}
var phrases = fs.readFileSync('phrases.bg5', {encoding: null}),
    phrasesRegex = /^(\S+)\s+\d+\s+(\S+)$/gm,
    topPhrases = [];  // character -> top phrase using it
phrases = iconv.decode(new Buffer(phrases), "big5");
while ((result = phrasesRegex.exec(phrases)) && topPhrases.length < topCharacters.length) {
    var phrase = result[1];
    for (var i=0; i < phrase.length; i++) {
        var c = phrase[i];
        if (topCharacters.indexOf(c) >= 0 && topPhrases[c] === undefined) {
            topPhrases[c] = phrase;
        }
    }
}
var phraseMap = [];  // phrase -> characters it sets pinyin for 
for (c in topPhrases) {
    phrase = topPhrases[c];
    var mappedChars = phraseMap[phrase];
    if (mappedChars === undefined) {
        phraseMap[phrase] = mappedChars = [];
    }
    mappedChars.push(c);
}
var pronunciations = fs.readFileSync('cedict.script', {encoding: 'utf-8'});
var sqlRegex = /^INSERT INTO CHARACTER VALUES\(\d+,'(.*)','(.*)','(.*)','.*'\)$/gm,
    pinyinRegex = /\D+\d/g,
    pinyinMap = {},  // character -> pinyin
    pinyinSingles = {},  // character -> pinyin
    simplified = {},  // traditional -> simplified
    pinyinCount = 0,
    line = "";
while ((result = sqlRegex.exec(pronunciations)) && pinyinCount < topCharacters.length) {
    // Capture groups are: traditional, simplified, pinyin.
    for (var i = 1; i <= 3; i++) {
        var json = '"' + result[i] + '"';
        result[i] = JSON.parse(json);
    }
    result[3] = result[3].toLowerCase();
    if (result[1].length > 1) {
        mappedChars = phraseMap[result[1]];
        if (mappedChars !== undefined) {
            var syllables = result[3].split(' ');
            for (i = 0; i < mappedChars.length; i++) {
                var mappedChar = mappedChars[i],
                    charIndex = result[1].indexOf(mappedChar);
                if (pinyinMap[mappedChar] === undefined) {
                    pinyinMap[mappedChar] = syllables[charIndex];
                    pinyinCount += 1;
                } 
            }
        }
    }
    else if (topCharacters.indexOf(result[1]) >= 0) {
        if (pinyinSingles[result[1]] === undefined) {
            pinyinSingles[result[1]] = result[3];
            if (result[1] !== result[2]) {
                simplified[result[1]] = result[2];
            }
        }
    }
}
for (c in pinyinSingles) {
    if (pinyinMap[c] === undefined) {
        pinyinMap[c] = pinyinSingles[c];
    }
}
for (c in manualOverrides) {
    pinyinMap[c] = manualOverrides[c];
}
var dump = {"boundaries": rankBoundaries},
    rank = 0;
for (var i = 0; i < rankBoundaries.length; i++) {
    var rankBoundary = rankBoundaries[i],
        pinyinGroup = {};
    dump[rankBoundary] = pinyinGroup;
    while (rank < rankBoundary) {
        var c = topCharacters[rank],
            simplifiedC = simplified[c],
            pinyinC = pinyinMap[c];
        pinyinGroup[c] = pinyinC;
        if (simplifiedC !== undefined) {
            pinyinGroup[simplifiedC] = pinyinC;
        }
        rank++;
    }
}

fs.writeFileSync('../src/charData.json', JSON.stringify(dump), {encoding: 'utf8'});
console.log('Written to charData.json.');
