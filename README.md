# Hades Save Manipulation

Manipulation of Hades save files. For the browser and Node.js.

### Notes on 1.1.0 release

First, no breaking changes, the read function still works.

A lot of features concerning building web-renderable game data have been implemented. It's a work in progress, likely buggy, and not 100% compliant with the game logic. Currently, the process of building and using that data is somewhat obscure and undocumented.

### Installation

`npm install hades_save_manipulation`

### Features

| Function | Input | Output | Description | Performance |
| ------------------ | ------------------ | ------------------ | ---------------------------------------------------------------------- | ------------------ |
| `readHadesSaveFromArrayBuffer` | ArrayBuffer or TypedArray or DataView | Object | Parses save file. | Thinkpad X260/Node 14/95 runs: ~350ms, ~3mb JSON size |

### Example usage (Node.js)

```javascript
import { readFile } from 'fs/promises';
import { readHadesSaveFromArrayBuffer } from 'hades_save_manipulation';

// Default save file locations:
//
// Windows:  C:/Users/<Your Windows username>/Documents/Saved Games/Hades
//           Note: You need to replace <Your Windows username> with your actual username.
//
// MacOS:    ~/Library/Application Support/Supergiant Games/Hades

const saveFileLocation = 'C:/Users/<Your Windows username>/Documents/Saved Games/Hades';
const saveFileProfileNumber = '1';

async function logSave() {
    // readFile returns a Uint8Array, which is a TypedArray.
    const saveFile = await readFile(
        `${saveFileLocation}/Profile${saveFileProfileNumber}.sav`
    );

    const save = readHadesSaveFromArrayBuffer(saveFile);
    
    console.log(save);
}

logSave();
```