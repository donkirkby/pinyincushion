import json


with open('chars.json') as inf:
    pinyin = json.loads(inf.read())

with open('char_freq.txt') as inf:
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
