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
        {input: '', output: ''}

        {input: 'liu2', output: 'liú'},
    ]
    testData.forEach((currentValue, index, array) => {
        expect(charData.convertPinyin(currentValue.input))
            .toEqual(currentValue.output);
    })
});

it('looks up pronunciation for characters', () => {
    expect(charData.getPinyin('你')).toEqual('nǐ');
});