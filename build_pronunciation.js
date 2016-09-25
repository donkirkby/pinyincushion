var fs = require('fs');

// cedict.script is downloaded from:
// https://sourceforge.net/p/zdt/svn/HEAD/tree/trunk/net.sourceforge.zdt.cedict/cedict.script
fs.readFile('cedict.script', {encoding: 'utf-8'}, function(err, data){
    if (err) {
        console.log(err);
    } else {
        var re = /^INSERT INTO CHARACTER VALUES\(\d+,'(.*)','(.*)','(.*)','.*'\)$/gm,
            characters = new Set(),
            line = "";
        while ((result = re.exec(data)) && characters.size < 10000) {
            for (var i = 2; i <= 3; i++) {
                var json = '"' + result[i] + '"';
                result[i] = JSON.parse(json);
            }
            if (result[2].length == 1) {
                if ( ! characters.has(result[2])) {
                    line += '"' + result[2] + '":"' + result[3] + '",';
                    characters.add(result[2]);
                    if (characters.size % 6 === 0) {
                        console.log(line);
                        line = "";
                    }
                }
            }
        }
    }
});