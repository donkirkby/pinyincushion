import codecs
import json


with codecs.open('chars.json', 'r', 'utf8') as inf:
    pinyin = json.loads(inf.read())

with codecs.open('char_freq.txt', 'r', 'utf8') as inf:
    char_freq = {}
    for k, line in enumerate(inf):
        traditional, frequency, num_strokes, simplified = line.split()
        frequency = int(frequency)
        num_strokes = int(num_strokes)
        char_freq[traditional] = {
            'pinyin': pinyin.get(traditional, ''),
            'freqRank': k + 1
        }
        char_freq[simplified] = {
            'pinyin': pinyin.get(simplified, ''),
            'freqRank': k + 1
        }

        if k == 5000:           # 5000 traditional + 5000 simplified
            break


with open('charData.json', 'wt') as opf:
    json.dump(char_freq, opf)

print('Done.')
