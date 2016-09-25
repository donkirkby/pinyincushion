var fs = require('fs');

// cedict.script is downloaded from:
// https://sourceforge.net/p/zdt/svn/HEAD/tree/trunk/net.sourceforge.zdt.cedict/cedict.script
fs.readFile('cedict.script', {encoding: 'utf-8'}, function(err, data){
    if (err) {
        console.log(err);
    } else {
        var re = /^INSERT INTO CHARACTER VALUES\(\d+,'(.*)','(.*)','(.*)','.*'\)$/gm,
            count = 0;
        while ((result = re.exec(data)) && count < 100) {
            console.log(result[1] + ': ' + result[3]);
            count += 1;
        }
    }
});