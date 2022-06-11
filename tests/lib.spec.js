import { backgroundPositionValue } from '@/lib/svg-utils';

let expected;
let xOffset;
let x;
let xUnits;
let yOffset;
let y;
let yUnits;

describe('background-position computed string', () => {
    // xOffset = null;
    // x = 0;
    // xUnits = null;
    // yOffset = null;
    // y = 0;
    // yUnits = null;
    test('x=0 y=0 → "0 0"', () => {
        expected = `0 0`;
        expect(backgroundPositionValue(null, 0, null, null, 0, null)).toEqual(expected);
    });

    test('x=0 xUnits="px" y=0 yUnits="px" → "0 0"', () => {
        expected = `0 0`;
        expect(backgroundPositionValue(null, 0, 'px', null, 0, 'px')).toEqual(expected);
    });

    test('x=0 xUnits="px" y=20 yUnits="px" → "0 20px"', () => {
        expected = `0 20px`;
        expect(backgroundPositionValue(null, 0, 'px', null, 20, 'px')).toEqual(expected);
    });

    test('x=20 xUnits="px" y=20 yUnits="px" → "20px 20px"', () => {
        expected = `20px 20px`;
        expect(backgroundPositionValue(null, 20, 'px', null, 20, 'px')).toEqual(expected);
    });
});

describe('background-position computed string with edge offset', () => {
    test('xOffset="left" x=0 xUnits="px" yOffset="bottom" y=0 yUnits="px" → "left bottom"', () => {
        expected = `left bottom`;
        expect(backgroundPositionValue('left', 0, 'px', 'bottom', 0, 'px')).toEqual(expected);
    });

    test('xOffset="left" x=20 xUnits="px" yOffset="bottom" y=20 yUnits="px" → "left 20px bottom 20px"', () => {
        expected = `left 20px bottom 20px`;
        expect(backgroundPositionValue('left', 20, 'px', 'bottom', 20, 'px')).toEqual(expected);
    });

    test('xOffset="left" x=0 xUnits="px" yOffset="bottom" y=20 yUnits="px"" → "left bottom 20px"', () => {
        expected = `left bottom 20px`;
        expect(backgroundPositionValue('left', 0, 'px', 'bottom', 20, 'px')).toEqual(expected);
    });

    test('xOffset="left" x=20 xUnits="px" yOffset="bottom" y=0 yUnits="px" → "left 20px bottom"', () => {
        expected = `left 20px bottom`;
        expect(backgroundPositionValue('left', 20, 'px', 'bottom', 0, 'px')).toEqual(expected);
    });

    test('xOffset=null x=0 xUnits="px" yOffset="bottom" y=20 yUnits="px" → "20px bottom"', () => {
        expected = `20px bottom`;
        expect(backgroundPositionValue(null, 0, 'px', 'bottom', 20, 'px')).toEqual(expected);
    });

    test('xOffset=null x=20 xUnits="px" yOffset="bottom y=20 yUnits="px" → "20px bottom"', () => {
        expected = `20px bottom`;
        expect(backgroundPositionValue(null, 20, 'px', 'bottom', 20, 'px')).toEqual(expected);
    });

    test('xOffset="right" x=20 xUnits="px" yOffset=null y=0 yUnits="px" → "right 20px"', () => {
        expected = `right 20px`;
        expect(backgroundPositionValue('right', 20, 'px', null, 0, 'px')).toEqual(expected);
    });

    test('xOffset="right" x=20 xUnits="px" yOffset=null y=20 yUnits="px" → "right 20px"', () => {
        expected = `right 20px`;
        expect(backgroundPositionValue('right', 20, 'px', null, 20, 'px')).toEqual(expected);
    });
});
