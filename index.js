'use strict';

const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const {
  layers,
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  rarityWeights,
  generation,
} = require("./config.js");
const console = require("console");
const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

// array to hold random editions. So that we don't save in order.
let randomEditionArray = [];

// func to fill the random edition array with all possible values given
// start and stop editions
const fillRandomEditionArray = (_arr) => {
  for(let i = startEditionFrom; i<editionSize+1; i++)
  {
    _arr.push(i);
  }
};

// func to get random edition from array
const getRandomEdition = (_arr) => {

  // get random element
  const randomEditionIndex = Math.floor(Math.random() * _arr.length);

  let randomEdition = _arr[randomEditionIndex];

  // remove element from arr so next created edition can't use it
  _arr.splice(randomEditionIndex, 1);

  return randomEdition;
};

// create output dir if doesn't exist
const dir = './output';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

let filesList = [{
  uri: "image.png", 
  type: "image.png",},
];

let creatorsList = [{
  address: "Zie2CxcBcL2YJf2PAwcFaDFuGN87WRSdbdhk1SWm8qh",
  share: 100,},
];

// saves the generated image to the output folder, using the edition count as the name
const saveImage = (_editionCount) => {
  fs.writeFileSync(
    `./output/${_editionCount}.png`,
    canvas.toBuffer("image/png")
  );
};

// adds a signature to the top left corner of the canvas
const signImage = (_sig) => {
  ctx.fillStyle = "#000000";
  ctx.font = "bold 30pt Courier";
  ctx.textBaseline = "top";
  ctx.textAlign = "left";
  ctx.fillText(_sig, 40, 40);
};

// generate a random color hue
const genColor = () => {
  let hue = Math.floor(Math.random() * 360);
  let pastel = `hsl(${hue}, 100%, 85%)`;
  return pastel;
};

const drawBackground = () => {
  ctx.fillStyle = genColor();
  ctx.fillRect(0, 0, width, height);
};

// add metadata for individual nft edition
const generateMetadata = (_dna, _edition, _attributesList) => {
  let dateTime = Date.now();
  let tempMetadata = {
    name: `Bear Rug ${_edition}`,
    symbol: ``,
    description: description,
    seller_fee_basis_points: 750,
    image: "image.png",
    external_url: "https://www.bearrugsnft.xyz/",
    attributes: _attributesList,
    collection: {
      name: `Bear Rugs Gen 1`,
      family: "Bear Rugs"},
    properties: {
      files: filesList,
      category: "image",
      creators: creatorsList,
    },
  };
  return tempMetadata;
};

// prepare attributes for the given element to be used as metadata
const getAttributeForElement = (_element) => {
  let selectedElement = _element.layer.selectedElement;
  let attribute = {
    trait_type: _element.layer.layerName,
    value: selectedElement.name,
  };
  return attribute;
};

// loads an image from the layer path
// returns the image in a format usable by canvas
const loadLayerImg = async (_layer) => {
  return new Promise(async (resolve) => {
    const image = await loadImage(`${_layer.selectedElement.path}`);
    resolve({ layer: _layer, loadedImage: image });
  });
};

const drawElement = (_element) => {
  ctx.drawImage(
    _element.loadedImage,
    _element.layer.position.x,
    _element.layer.position.y,
    _element.layer.size.width,
    _element.layer.size.height
  );
};

// check the configured layer to find information required for rendering the layer
// this maps the layer information to the generated dna and prepares it for
// drawing on a canvas
const constructLayerToDna = (_dna = [], _layers = [], _rarity) => {
  let mappedDnaToLayers = _layers.map((layer, index) => {
    let selectedElement = layer.elements.find(element => element.name === _dna[index]);
    return {
      location: layer.location,
      position: layer.position,
      size: layer.size,
      layerName: layer.id,
      selectedElement: selectedElement,
    };
  });
  return mappedDnaToLayers;
};

// check if the given dna is contained within the given dnaList 
// return true if it is, indicating that this dna is already in use and should be recalculated
const isDnaUnique = (_DnaList = [], _dna = []) => {
  let foundDna = _DnaList.find((i) => i.join("") === _dna.join(""));
  return foundDna == undefined ? true : false;
};

const getRandomRarity = (_rarityOptions) => {
  let randomPercent = Math.random() * 100;
  let percentCount = 0;

  for (let i = 0; i <= _rarityOptions.length; i++) {
    percentCount += _rarityOptions[i].percent;
    if (percentCount >= randomPercent) {
      return _rarityOptions[i].id;
    }
  }
  return _rarityOptions[0].id;
}

// create a dna based on the available layers for the given rarity
// use a random part for each layer
const createDna = (_layers, _rarity) => {
  let randNum = [];
  let _rarityWeight = rarityWeights.find(rw => rw.value === _rarity);
  let isCommonBackground = false;
  _layers.forEach((layer) => {
    let num = Math.floor(Math.random() * layer.elementIdsForRarity[_rarity].length);
    if (_rarityWeight && _rarityWeight.layerPercent[layer.id]) {
      // if there is a layerPercent defined, we want to identify which dna to actually use here (instead of only picking from the same rarity)
      let _rarityForLayer = getRandomRarity(_rarityWeight.layerPercent[layer.id]);
      
      if (layer.id == 'background')
      {
        if (_rarityForLayer == 'common')
        {
          isCommonBackground = true;
        }
      }
      // change rarity for art layer if background is plain
      if (layer.id == 'art')
      {
        let rarityPercent = [];
        if (isCommonBackground)
        {
          rarityPercent = [
            { id: 'super legendary', percent: 0 },
            { id: 'legendary', percent: 0 },
            { id: 'rare', percent: 0 },
            { id: 'uncommon', percent: 50 },
            { id: 'common', percent: 50 }
          ]
        }
        else
        {
          // if not plain background, give 100% chance of no painting
          rarityPercent = [
            { id: 'super legendary', percent: 0 },
            { id: 'legendary', percent: 0 },
            { id: 'rare', percent: 0 },
            { id: 'uncommon', percent: 100 },
            { id: 'common', percent: 0 }
          ]
        }
        _rarityForLayer = getRandomRarity(rarityPercent);
      }

      // get random index in rarity folder
      num = Math.floor(Math.random() * layer.elementIdsForRarity[_rarityForLayer].length);
      let id = layer.elementIdsForRarity[_rarityForLayer][num];
      let selectedElement = layer.elements.find(element => element.id === id);
      randNum.push(selectedElement.name);
    } else {
      let id = layer.elementIdsForRarity[_rarity][num];
      let selectedElement = layer.elements.find(element => element.id === id);
      randNum.push(selectedElement.name);
    }
  });
  return randNum;
};

// holds which rarity should be used for which image in edition
let rarityForEdition;
// get the rarity for the image by edition number that should be generated
const getRarity = (_editionCount) => {
  if (!rarityForEdition) {
    // prepare array to iterate over
    rarityForEdition = [];
    rarityWeights.forEach((rarityWeight) => {

      for (let i = rarityWeight.from; i <= rarityWeight.to; i++) {
        rarityForEdition.push(rarityWeight.value);
      }
    });
  }
  console.log('rarity for edition')
  console.log(rarityForEdition[0])
  return rarityForEdition[_editionCount];
};

const writeMetaData = (_data) => {
  fs.writeFileSync("./_metadata.json", _data);
};

const writeDnaList = (_data) => {
  fs.writeFileSync(`./dnaList.json`, _data);
};

// holds which dna has already been used during generation
let dnaList = []

// read dnaList from previous generations if it exists
const dnaListPath = './dnaList.json';
if (fs.existsSync(dnaListPath)){
  let rawdata = fs.readFileSync(dnaListPath);
  dnaList = JSON.parse(rawdata);
}

// holds metadata for all NFTs
let metadataList = [];
// Create generative art by using the canvas api
const startCreating = async () => {
  fillRandomEditionArray(randomEditionArray);

  console.log('##################');
  console.log('# Generative Art');
  console.log('# - Create your NFT collection');
  console.log('##################');

  console.log();
  console.log('start creating NFTs.')

  // create NFTs from startEditionFrom to editionSize
  let editionCount = startEditionFrom;
  //let editionCount = 9;
  while (editionCount <= editionSize) {
    console.log('-----------------')
    console.log('creating NFT %d of %d', editionCount, editionSize);

    // get rarity from to config to create NFT as
    let rarity = getRarity(editionCount);
    console.log('- rarity: ' + rarity);

    // calculate the NFT dna by getting a random part for each layer/feature 
    // based on the ones available for the given rarity to use during generation
    let newDna = createDna(layers, rarity);
    while (!isDnaUnique(dnaList, newDna)) {
      // recalculate dna as this has been used before.
      console.log('found duplicate DNA ' + newDna.join('-') + ', recalculate...');
      newDna = createDna(layers, rarity);
    }
    console.log('- dna: ' + newDna.join('-'));

    // propagate information about required layer contained within config into a mapping object
    // = prepare for drawing
    let results = constructLayerToDna(newDna, layers, rarity);
    let loadedElements = [];

    // load all images to be used by canvas
    results.forEach((layer) => {
      loadedElements.push(loadLayerImg(layer));
    });

    // elements are loaded asynchronously
    // -> await for all to be available before drawing the image
    await Promise.all(loadedElements).then((elementArray) => {
      // create empty image
      ctx.clearRect(0, 0, width, height);
      // draw a random background color
      drawBackground();
      // store information about each layer to add it as meta information
      let attributesList = [];
      // draw each layer
      elementArray.forEach((element) => {
        drawElement(element);
        attributesList.push(getAttributeForElement(element));
      });

      // get a random edition number so we don't save the images in order.
      // This way candy machine rarity isn't based on order of mint
      let randomEditionNumber = getRandomEdition(randomEditionArray);

      // write the image to the output directory with RANDOM edition
      saveImage(randomEditionNumber);

      // use CURRENT edition in metadata
      let nftMetadata = generateMetadata(newDna, editionCount, attributesList);
      metadataList.push(nftMetadata)

      // use same random edition for metadata saved filename
      fs.writeFileSync("./output/"+randomEditionNumber.toString()+".json", JSON.stringify(nftMetadata));
      console.log('- metadata: ' + JSON.stringify(nftMetadata));
      console.log('- edition ' + editionCount + ' created.');
      console.log('- random edition ' + randomEditionNumber + ' created.');
      console.log();
    });
    dnaList.push(newDna);
    editionCount++;
  }
  writeMetaData(JSON.stringify(metadataList));
  writeDnaList(JSON.stringify(dnaList))
};

// Initiate code
startCreating();