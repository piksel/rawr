import { writeFileSync } from 'node:fs'

const ranges = [
    [0x00, 0x19], 
    0x7F, 
    [0x80, 0xFF]
];
const indexes = ranges.flatMap(arg => 
    typeof arg == 'number' ? arg : 
    Array.from(Array((arg[1] - arg[0]) + 1), (_, i) => i)
)
// const items = Array.from(ranges, () => (0x7f + i).toString(16).toUpperCase())

const charRefs = {
    '0': 194 + 0x0,
    '1': 194 + 0x1,
    '2': 194 + 0x2,
    '3': 194 + 0x3,
    '4': 194 + 0x4,
    '5': 194 + 0x5,
    '6': 194 + 0x6,
    '7': 194 + 0x7,
    '8': 194 + 0x8,
    '9': 194 + 0x9,
    'A': 194 + 0xA,
}

for (let index of indexes) {
    const hexId = index.toString(16).toUpperCase().padStart(2, '0');
    const refId = 211 + index;

const tpl = `
StartChar: uni00${hexId}
Encoding: ${index} ${index} ${refId}
Width: 1155
Flags: W
LayerCount: 2
Fore
Refer: 204 -1 N 1 0 0 1 0 0 0
Refer: ${charRefs[hexId[1]]} -1 S 1 0 0 1 637 462 0
Refer: ${charRefs[hexId[0]]} -1 N 1 0 0 1 637 30 0
EndChar
`;

console.log(tpl);
break;

}