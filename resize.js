"use strict";

const Jimp = require('jimp');
const fs = require('fs');

const folderPath = process.argv[2];
const files = fs.readdirSync(folderPath);

const metadata = [];

const operations = files.map(file => {
    return Jimp.read(`${folderPath}\\${file}`).then(image => {
        image.resize(48, 48)
             .write(`output\\planet-${image.hash()}.png`);

        return image;
    }).then(image => {
        metadata.push({
            kind: 'planet',
            id: image.hash(),
            filename: `planet-${image.hash()}.png`,
            widht: 48,
            height: 48
        });
    });
});

Promise.all(operations).then(() => {
    console.log(`${files.length} files resized.`);
    fs.writeFileSync('output\\metadata.json', JSON.stringify(metadata, null, 2));
    console.log('Metadata file written.');
}).catch(err => {
    console.error(err);
});
