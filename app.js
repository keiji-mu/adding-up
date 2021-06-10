'use strict';
const fs = require('fs');
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv');
const rl = readline.createInterface({input:rs, output:{}});
const prefectureDataMap = new Map();
rl.on('line', lineString => { 
    const [year, prefecture, popu] = lineString.split(',');
    if (year == 2010 || year == 2015) {
        const value = prefectureDataMap.get( prefecture) || {};
        if (year == 2010) value.popu10 = popu;
        if (year == 2015) value.popu15 = popu;
        prefectureDataMap.set( prefecture, value);
    }
});
rl.on('close', () => {
    for (const [key, value] of prefectureDataMap) {
        value.change = value.popu15 / value.popu10;
    }
    const rankingArray = Array.from( prefectureDataMap).sort(([,{change:c1}],[,{change:c2}])=>c2-c1);
    const rankingString = rankingArray.map(([key,value]) => `${key}: ${value.popu10}=>${value.popu15} 変化率:${value.change}`);
    console.log( rankingString);
})