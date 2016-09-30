import punycode from 'punycode';

// parsed from https://sourceforge.net/p/zdt/svn/HEAD/tree/tags/0.7.0b3/net.sourceforge.zdt.cedict/cedict.script
import chars from './charData.json';


var charData = {
    getPinyin: function(char) {
        var props = chars[char];
        if (props === undefined) {
            return "";
        } else {
            return charData.convertTone(props.pinyin);
        }
    },

    getFreqRank: function(char) {
        var props = chars[char];
        if (props === undefined) {
            // return any large number to indicate it's a rarely used char
            return 99999;
        } else {
            return props.freqRank;
        }
    },
    
    /** Convert pinyin tone number to tone mark on a single syllable. */
    convertTone: function(pinyin) {
        var toneMatch = pinyin.match(/^(.*)(\d+)$/)
        if (toneMatch === null) {
            return pinyin;
        }
        var tone = parseInt(toneMatch[2]),
            vowels = ['a', 'e', 'i', 'o', 'v', 'u:', 'u'],
            accents = 'āáǎàēéěèīíǐìōóǒòǖǘǚǜǖǘǚǜūúǔù',
            bestVowelIndex,
            bestVowel;
        pinyin = toneMatch[1];
        
        for (var vowelIndex in vowels) {
            var vowel = vowels[vowelIndex],
                i = pinyin.indexOf(vowel);
            if (i > -1) {
                if (bestVowelIndex === undefined ||
                        (i > bestVowelIndex && bestVowel > 'e')) {
                    bestVowelIndex = i;
                    bestVowel = vowel;
                }
            }
        }
        // special case for "ou".
        i = pinyin.indexOf("ou");
        if (i > -1) {
            bestVowelIndex = i;
            bestVowel = "o";
        }
        if (bestVowel !== undefined) {
            var prefix = pinyin.substring(0, bestVowelIndex),
                suffix = pinyin.substring(bestVowelIndex + bestVowel.length),
                accent = accents[vowels.indexOf(bestVowel)*4 + tone - 1];
            if (tone === 0 || tone === 5) {
                accent = bestVowel;
            }
            return prefix + accent + suffix;
        }

        return tone;
    },
    
    splitChars: function(text) {
        var decoded = punycode.ucs2.decode(text),
            chars = [],
            c,
            pinyinStartIndex;
        
        for (var i = 0; i < decoded.length; i++) {
            c = punycode.ucs2.encode(decoded.slice(i, i+1));
            if (pinyinStartIndex === undefined) {
                if (c === '{' && i > 0) {
                    pinyinStartIndex = i+1;
                }
                else {
                    chars.push({c: c, p:charData.getPinyin(c)});
                }
            }
            else if (c === '}') {
                chars[chars.length-1].p = charData.convertTone(
                        punycode.ucs2.encode(decoded.slice(pinyinStartIndex, i)));
                pinyinStartIndex = undefined;
            }
        }
        if (pinyinStartIndex !== undefined) {
            chars[chars.length-1].p = charData.convertTone(
                    punycode.ucs2.encode(decoded.slice(pinyinStartIndex)));
        }
        return chars;
    }
};


export default charData;
