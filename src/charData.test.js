import charData from './charData';

it('converts pinyin tone numbers to accents', () => {
    let testData = [
        {input: 'ni3', output: 'nǐ'},
        {input: 'li4', output: 'lì'},
        {input: 'liu4', output: 'lìu'},
        {input: 'hua1', output: 'huā'},
        {input: 'nu3', output: 'nǔ'},
        {input: 'nv3', output: 'nǚ'},
        {input: 'nu:3', output: 'nǚ'},
        {input: 'ma', output: 'ma'},
        {input: 'ma0', output: 'ma'},
        {input: '', output: ''},

        //TODO: {input: 'liu2', output: 'liú'}
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