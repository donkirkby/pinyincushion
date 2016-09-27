// parsed from https://sourceforge.net/p/zdt/svn/HEAD/tree/tags/0.7.0b3/net.sourceforge.zdt.cedict/cedict.script
import chars from './charData.json';


var charData = (function() {
    var my = {};

    my.getPinyin = function(char) {
        var props = chars[char];
        if (props === undefined) {
            return "";
        } else {
            return props.pinyin;
        }
    };

    my.getFreqRank = function(char) {
        var props = chars[char];
        if (props === undefined) {
            // return any large number to indicate it's a rarely used char
            return 99999;
        } else {
            return props.freqRank;
        }
    };

    return my;
}());


export default charData;
