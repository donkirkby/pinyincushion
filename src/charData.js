// parsed from https://sourceforge.net/p/zdt/svn/HEAD/tree/tags/0.7.0b3/net.sourceforge.zdt.cedict/cedict.script
import chars from './charData.json';


var charData = {
    getPinyin: function(char) {
        var props = chars[char];
        if (props === undefined) {
            return "";
        } else {
            return charData.convertPinyin(props.pinyin);
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
    
    convertPinyin: function(pinyin) {
        var toneMatch = pinyin.match(/^(.*)(\d+)$/)
        if (toneMatch === null) {
            return pinyin;
        }
        var tone = parseInt(toneMatch[2]),
            vowels = ['a', 'e', 'i', 'o', 'v', 'u:', 'u'],
            accents = 'āáăàēéěèīíǐìōóǒòǖǘǚǜǖǘǚǜūúǔù';
        pinyin = toneMatch[1];
        
        for (var vowelIndex in vowels) {
            var vowel = vowels[vowelIndex];
            var i = pinyin.indexOf(vowel);
            if (i > -1) {
                var prefix = pinyin.substring(0, i),
                    suffix = pinyin.substring(i+vowel.length),
                    accent = accents[vowelIndex*4 + tone - 1];
                if (tone === 0) {
                    accent = vowel;
                }
                return prefix + accent + suffix;
            }
        }
        return tone;
    }
};


export default charData;
