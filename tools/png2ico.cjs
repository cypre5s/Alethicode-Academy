const fs = require('fs')
const path = require('path')

const pngPath = path.join(__dirname, '..', 'favicon.ico')
const outPath = path.join(__dirname, '..', 'app-icon.ico')

const pngData = fs.readFileSync(pngPath)

const header = Buffer.alloc(6)
header.writeUInt16LE(0, 0)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(1, 4)

const dirEntry = Buffer.alloc(16)
dirEntry.writeUInt8(0, 0)
dirEntry.writeUInt8(0, 1)
dirEntry.writeUInt8(0, 2)
dirEntry.writeUInt8(0, 3)
dirEntry.writeUInt16LE(1, 4)
dirEntry.writeUInt16LE(32, 6)
dirEntry.writeUInt32LE(pngData.length, 8)
dirEntry.writeUInt32LE(6 + 16, 12)

const ico = Buffer.concat([header, dirEntry, pngData])
fs.writeFileSync(outPath, ico)
console.log('Created app-icon.ico (' + ico.length + ' bytes)')
