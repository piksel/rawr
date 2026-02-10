import { writeFileSync, readFileSync } from 'node:fs'

const fontBasePath = 'rawr.sfdir'

const getRefId = name => {
    const fc = readFileSync(`${fontBasePath}/${name}.glyph`, {encoding: 'utf-8'});
    const m = /Encoding: [\d|-]+ [\d|-]+ ([\d|-]+)/gm.exec(fc);
    if (!m) {
        throw new Error('Could not find reference ID for ' + name);
    }
    console.log('RefID for %o is %o', name, parseInt(m[1], 10));
    return m[1];
}

const ranges = [
    [0x00, 0x1F], // CONTROL
    0x7F, // ESC
    [0x80, 0xFF] // >ASCII
];
const indexes = ranges.flatMap(arg => 
    typeof arg == 'number' ? arg : 
    Array.from(Array((arg[1] - arg[0]) + 1), (_, i) => arg[0] + i)
)

const charRefs = {
    '0': getRefId('zero'),
    '1': getRefId('one'),
    '2': getRefId('two'),
    '3': getRefId('three'),
    '4': getRefId('four'),
    '5': getRefId('five'),
    '6': getRefId('six'),
    '7': getRefId('seven'),
    '8': getRefId('eight'),
    '9': getRefId('nine'),
    'A': getRefId('_A'), // CAPS = _
    'B': getRefId('_B'),
    'C': getRefId('_C'),
    'D': getRefId('_D'),
    'E': getRefId('_E'),
    'F': getRefId('_F'),
}

const refScale = c => 0.5;//c < 'A' ? 0.5 : 0.7;
// const refScaleY = 0.5;
const xPos = 150;
const yPos = [462, 30];

const boxId = getRefId('rawbox');
const boxPosX = 0;
const boxPosY = 0;
const boxScale = 1;
const box = `Refer: ${boxId} -1 N ${boxScale} 0 0 ${boxScale} ${boxPosX} ${boxPosY} 0`;

for (let index of indexes) {
    const hexId = index.toString(16).toUpperCase().padStart(2, '0');
    const refId = 211 + index;
    const glyphFile = `${fontBasePath}/uni00${hexId}.glyph`;

    const rendered = `StartChar: uni00${hexId}
Encoding: ${index} ${index} ${refId}
Width: 600
Flags: W
LayerCount: 2
Fore
${box}
Refer: ${charRefs[hexId[0]]} -1 N ${refScale(hexId[0])} 0 0 ${refScale(hexId[0])} ${xPos} ${yPos[0]} 0
Refer: ${charRefs[hexId[1]]} -1 N ${refScale(hexId[1])} 0 0 ${refScale(hexId[1])} ${xPos} ${yPos[1]} 0
EndChar
`;

    let current = null;
    try {
        current = readFileSync(glyphFile, {encoding: 'utf-8'}).replaceAll('\r\n','\n');
    }
    catch (e) {console.warn(e)}
    if (current === rendered) {
        console.info(`${glyphFile}: Matches!`)
    } else {
        console.info(`${glyphFile}: Updated.`);
        writeFileSync(glyphFile, rendered, {encoding: 'utf-8'})
    }
}