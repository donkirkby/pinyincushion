// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  "use strict";

  $('#text').keyup(function() {
    var text = $(this).val(),
        display = "",
        $display = $("#display"),
        $content = $(""),
        char,
        pinyin,
        $ruby,
        i;
    $display.empty();
    for (i = 0; i < text.length; i++) {
      char = text.charAt(i);
      pinyin = pronunciation.getPinyin(char);
      display += pronunciation.getPinyin(text.charAt(i));
      $ruby = $("<ruby/>").text(char).append($("<rt/>").text(pinyin));
      $display.append($ruby);
    }
  });

});
