The frequency data is downloaded from
http://technology.chtsai.org/charfreq/sorted.html

Then traditional Chinese is converted to simplified Chinese via http://www.hao123.com/haoserver/jianfanzh.htm.

NOTE: Tried Google Translate, but it is buggy. e.g.

```
了     1507218   2      了
瞭       12167  17      了
暸         772  16      了
```

A `charData.json` file will be generated after running `convert_to_json.py`, and
it's mannually moved to `pinyincushion/src` for use.
