'use strict';

const fs = require('fs');

// read json data
let rawdata = fs.readFileSync('dnaList.json');
let data = JSON.parse(rawdata);

// convert dna data list to strings list
let stringDna = []
const len = data.length;
for (let i = 0; i < len; i++) {
	let newString = ""
	for (let j = 0; j < data[i].length; j++) {
		newString+=data[i][j];
	}
	stringDna.push(newString)
}

console.log("dna size:")
console.log(stringDna.length)
console.log("unique dna size:")
console.log(new Set(stringDna).size)

let isUnique = (new Set(stringDna)).size === stringDna.length;

console.log("is unique:")
console.log(isUnique)
