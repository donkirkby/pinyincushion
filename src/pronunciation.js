// parsed from https://sourceforge.net/p/zdt/svn/HEAD/tree/tags/0.7.0b3/net.sourceforge.zdt.cedict/cedict.script
var chars = require('./chars.json');


var pronunciation = (function() {
  var my = {};
  my.getPinyin = function(char) {
    var pinyin = chars[char];
    if (pinyin === undefined) {
      pinyin = "";
    }
    return pinyin;
  };

  return my;
}());


export default pronunciation;
