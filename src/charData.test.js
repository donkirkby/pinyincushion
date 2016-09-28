import charData from './charData';

it('converts pinyin tone numbers to accents', () => {
    expect(charData.convertPinyin('ni3')).toEqual('nǐ');
    expect(charData.convertPinyin('li4')).toEqual('lì');
    expect(charData.convertPinyin('liu4')).toEqual('lìu');
    expect(charData.convertPinyin('hua1')).toEqual('huā');
    expect(charData.convertPinyin('nu3')).toEqual('nǔ');
    expect(charData.convertPinyin('nv3')).toEqual('nǚ');
    expect(charData.convertPinyin('nu:3')).toEqual('nǚ');
    expect(charData.convertPinyin('ma')).toEqual('ma');
    expect(charData.convertPinyin('ma0')).toEqual('ma');
    expect(charData.convertPinyin('')).toEqual('');
});

it('looks up pronunciation for characters', () => {
    expect(charData.getPinyin('你')).toEqual('nǐ');
});