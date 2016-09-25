var pronunciation = (function() {
  "use strict";
  var my = {};
  my.getPinyin = function(char) {
    var pinyin = chars[char];
    if (pinyin === undefined) {
      pinyin = "";
    }
    return pinyin;
  }
  // parsed from https://sourceforge.net/p/zdt/svn/HEAD/tree/tags/0.7.0b3/net.sourceforge.zdt.cedict/cedict.script
  var chars = {'你': 'ni3', '好': 'hao3'};
  return my;
}());