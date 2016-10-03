import charData from './charData';

it('converts pinyin tone numbers to accents', () => {
    let testData = [
        {input: 'ni3', output: 'nǐ'},
        {input: 'nin3', output: 'nǐn'},
        {input: 'li4', output: 'lì'},
        {input: 'hua1', output: 'huā'}, // a always takes tone
        {input: 'pao3', output: 'pǎo'},
        {input: 'que4', output: 'què'}, // e always takes tone
        {input: 'lei4', output: 'lèi'},
        {input: 'shou3', output: 'shǒu'}, // special case for ou
        {input: 'liu2', output: 'liú'}, // everything else is final vowel
        {input: 'tui1', output: 'tuī'},
        {input: 'qiong2', output: 'qióng'},
        {input: 'nu3', output: 'nǔ'}, // different kinds of u
        {input: 'nv3', output: 'nǚ'},
        {input: 'nu:3', output: 'nǚ'},
        {input: 'ma', output: 'ma'}, // different ways to mark neutral tone
        {input: 'ma0', output: 'ma'},
        {input: 'ma5', output: 'ma'},
        {input: '', output: ''}, // blank
    ]
    testData.forEach((currentValue, index, array) => {
        expect(charData.convertTone(currentValue.input))
            .toEqual(currentValue.output);
    })
});

it('looks up pronunciation for characters', () => {
    expect(charData.getPinyin('你')).toEqual('nǐ');
});

it('splits text into characters', () => {
    expect(charData.splitChars('你好')).toEqual(
            [{c: '你', p: 'nǐ'}, {c: '好', p: 'hǎo'}]);
});
it('splits text into characters with pinyin override', () => {
    expect(charData.splitChars('我得{dei3}去')).toEqual(
            [{c: '我', p: 'wǒ'}, {c: '得', p: 'děi'}, {c: '去', p: 'qù'}]);
    expect(charData.splitChars('我得{dei3')).toEqual(
            [{c: '我', p: 'wǒ'}, {c: '得', p: 'děi'}]);
    expect(charData.splitChars('{dei3}去')).toEqual(
            [{c: '{', p: ''},
             {c: 'd', p: ''},
             {c: 'e', p: ''},
             {c: 'i', p: ''},
             {c: '3', p: ''},
             {c: '}', p: ''},
             {c: '去', p: 'qù'}]);
});
it('handles Unicode code pairs', () => {
    // See: https://github.com/bestiejs/punycode.js/#punycodeucs2
    expect(charData.splitChars('𠮷')).toEqual([{c: '𠮷', p:''}]);
});
