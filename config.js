/**************************************************************
 * UTILITY FUNCTIONS
 * - scroll to BEGIN CONFIG to provide the config values
 *************************************************************/
const fs = require("fs");
const imageDir = '/input/'
const dir = __dirname + imageDir;

// adds a rarity to the configuration. This is expected to correspond with a directory containing the rarity for each defined layer
// @param _id - id of the rarity
// @param _from - number in the edition to start this rarity from
// @param _to - number in the edition to generate this rarity to
// @return a rarity object used to dynamically generate the NFTs
const addRarity = (_id, _from, _to) => {
  const _rarityWeight = {
    value: _id,
    from: _from,
    to: _to,
    layerPercent: {}
  };
  return _rarityWeight;
};

// get the name without last 4 characters -> slice .png from the name
const cleanName = (_str) => {
  let name = _str.slice(0, -4);
  return name;
};

// reads the filenames of a given folder and returns it with its name and path
const getElements = (_path, _elementCount) => {
  return fs
    .readdirSync(_path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i) => {
      return {
        id: _elementCount,
        name: cleanName(i),
        path: `${_path}/${i}`
      };
    });
};

// adds a layer to the configuration. The layer will hold information on all the defined parts and 
// where they should be rendered in the image
// @param _id - id of the layer
// @param _position - on which x/y value to render this part
// @param _size - of the image
// @return a layer object used to dynamically generate the NFTs
const addLayer = (_id, _position, _size) => {
  if (!_id) {
    console.log('error adding layer, parameters id required');
    return null;
  }
  if (!_position) {
    _position = { x: 0, y: 0 };
  }
  if (!_size) {
    _size = { width: width, height: height }
  }
  // add two different dimension for elements:
  // - all elements with their path information
  // - only the ids mapped to their rarity
  let elements = [];
  let elementCount = 0;
  let elementIdsForRarity = {};
  rarityWeights.forEach((rarityWeight) => {
    let elementsForRarity = getElements(`${dir}/${_id}/${rarityWeight.value}`);

    elementIdsForRarity[rarityWeight.value] = [];
    elementsForRarity.forEach((_elementForRarity) => {
      _elementForRarity.id = `${editionDnaPrefix}${elementCount}`;
      elements.push(_elementForRarity);
      elementIdsForRarity[rarityWeight.value].push(_elementForRarity.id);
      elementCount++;
    })
    elements[rarityWeight.value] = elementsForRarity;
  });

  let elementsForLayer = {
    id: _id,
    position: _position,
    size: _size,
    elements,
    elementIdsForRarity
  };
  return elementsForLayer;
};

// adds layer-specific percentages to use one vs another rarity
// @param _rarityId - the id of the rarity to specifiy
// @param _layerId - the id of the layer to specifiy
// @param _percentages - an object defining the rarities and the percentage with which a given rarity for this layer should be used
const addRarityPercentForLayer = (_rarityId, _layerId, _percentages) => {
  let _rarityFound = false;
  rarityWeights.forEach((_rarityWeight) => {
    if (_rarityWeight.value === _rarityId) {
      let _percentArray = [];
      for (let percentType in _percentages) {
        _percentArray.push({
          id: percentType,
          percent: _percentages[percentType]
        })
      }
      _rarityWeight.layerPercent[_layerId] = _percentArray;
      _rarityFound = true;
    }
  });
  if (!_rarityFound) {
    console.log(`rarity ${_rarityId} not found, failed to add percentage information`);
  }
}

/**************************************************************
 * BEGIN CONFIG
 *************************************************************/

// image width in pixels
const width = 2048;
// image height in pixels
const height = 2048;
// description for NFT in metadata file
const description = "Bear rugs not drugs";
// base url to use in metadata file
// the id of the nft will be added to this url, in the example e.g. https://hashlips/nft/1 for NFT with id 1
const baseImageUri = "";
// id for edition to start from
const startEditionFrom = 0;
// amount of NFTs to generate in edition
const editionSize = 9999;
// prefix to add to edition dna ids (to distinguish dna counts from different generation processes for the same collection)
const editionDnaPrefix = 0
// generation to use
const generation = 1;

// create required weights
// for each weight, call 'addRarity' with the id and from which to which element this rarity should be applied
let rarityWeights = [
  addRarity('super legendary', 0, 30),
  addRarity('legendary', 31, 100),
  addRarity('rare', 101, 250),
  addRarity('uncommon', 251, 500),
  addRarity('common', 500, 999)
];

// create required layers
// for each layer, call 'addLayer' with the id and optionally the positioning and size
// the id would be the name of the folder in your input directory, e.g. 'ball' for ./input/ball
const layers = [
  addLayer('background', { x: 0, y: 0 }, { width: width, height: height }),
  addLayer('art'),
  addLayer('floor'),
  addLayer('bear'),
  addLayer('figure'),
  addLayer('earrings'),
  addLayer('eyes'),
  addLayer('nose'),
  addLayer('hat'),
  addLayer('glasses'),
  addLayer('mouth'),
];

// provide any specific percentages that are required for a given layer and rarity level

// Super legendary will have Elizabeth, so don't use legendary backgrounds (dino, sphinx, shark, lion), they dont look great with
addRarityPercentForLayer('super legendary', 'background', {'super legendary': 85, 'legendary': 0, 'rare': 6.6, 'uncommon': 6.3, 'common': 2.1 });
addRarityPercentForLayer('super legendary', 'art', {'super legendary': 0, 'legendary': 0, 'rare': 0, 'uncommon': 100, 'common': 0 });
addRarityPercentForLayer('super legendary', 'floor', {'super legendary': 70, 'legendary': 29.3, 'rare': 0.3, 'uncommon': 0.3, 'common': 0.1 });
addRarityPercentForLayer('super legendary', 'bear', {'super legendary': 70, 'legendary': 29.3, 'rare': 0.3, 'uncommon': 0.3, 'common': 0.1 });
// super legendarys always have Elizabeth
addRarityPercentForLayer('super legendary', 'figure', {'super legendary': 100, 'legendary': 0, 'rare': 0, 'uncommon': 0, 'common': 0 });
addRarityPercentForLayer('super legendary', 'earrings', {'super legendary': 49.1, 'legendary': 0.3, 'rare': 0.3, 'uncommon': 0.3, 'common': 50 });
addRarityPercentForLayer('super legendary', 'eyes', {'super legendary': 99, 'legendary': 0.3, 'rare': 0.3, 'uncommon': 0.3, 'common': 0.1 });
addRarityPercentForLayer('super legendary', 'nose', {'super legendary': 35, 'legendary': 30, 'rare': 0, 'uncommon': 0, 'common': 35 });
// super legendarys can only use hats from super legendary and uncommon (common is no hat) (rare and legendary hats are too big and get in way of burt figure)
addRarityPercentForLayer('super legendary', 'hat', {'super legendary': 40.1, 'legendary': 3.3, 'rare': 3.3, 'uncommon': 3.3, 'common': 50 });
addRarityPercentForLayer('super legendary', 'glasses', {'super legendary': 49.1, 'legendary': 0.3, 'rare': 0.3, 'uncommon': 0.3, 'common': 50 });
addRarityPercentForLayer('super legendary', 'mouth', {'super legendary': 70, 'legendary': 29.3, 'rare': 0.3, 'uncommon': 0.3, 'common': 0.1 });

addRarityPercentForLayer('legendary', 'background', {'super legendary': 7, 'legendary': 71, 'rare': 12, 'uncommon': 7, 'common': 3 });
addRarityPercentForLayer('legendary', 'art', {'super legendary': 0, 'legendary': 0, 'rare': 0, 'uncommon': 100, 'common': 0 });
addRarityPercentForLayer('legendary', 'floor', {'super legendary': 7, 'legendary': 71, 'rare': 12, 'uncommon': 7, 'common': 3 });
addRarityPercentForLayer('legendary', 'bear', {'super legendary': 7, 'legendary': 71, 'rare': 12, 'uncommon': 7, 'common': 3 });
// 80% chance of Burt on legendary
addRarityPercentForLayer('legendary', 'figure', {'super legendary': 0, 'legendary': 80, 'rare': 0, 'uncommon': 0, 'common': 20 });
addRarityPercentForLayer('legendary', 'earrings', {'super legendary': 1, 'legendary': 37, 'rare': 7, 'uncommon': 5, 'common': 50 });
addRarityPercentForLayer('legendary', 'eyes', {'super legendary': 7, 'legendary': 71, 'rare': 12, 'uncommon': 7, 'common': 3 });
addRarityPercentForLayer('legendary', 'nose', {'super legendary': 25, 'legendary': 40, 'rare': 0, 'uncommon': 0, 'common': 35 });
// Don't use legendary or rare hats for legendary, just avoiding them in case Burt is picked
addRarityPercentForLayer('legendary', 'hat', {'super legendary': 20, 'legendary': 0, 'rare': 0, 'uncommon': 30, 'common': 50 });
addRarityPercentForLayer('legendary', 'glasses', {'super legendary': 1, 'legendary': 37, 'rare': 7, 'uncommon': 5, 'common': 50 });
addRarityPercentForLayer('legendary', 'mouth', {'super legendary': 7, 'legendary': 71, 'rare': 12, 'uncommon': 7, 'common': 3 });

addRarityPercentForLayer('rare', 'background', {'super legendary': 1.2, 'legendary': 2.8, 'rare': 75, 'uncommon': 15, 'common': 6 });
addRarityPercentForLayer('rare', 'art', {'super legendary': 0, 'legendary': 0, 'rare': 0, 'uncommon': 100, 'common': 0 });
addRarityPercentForLayer('rare', 'floor', {'super legendary': 1.2, 'legendary': 2.8, 'rare': 75, 'uncommon': 15, 'common': 6 });
addRarityPercentForLayer('rare', 'bear', {'super legendary': 1.2, 'legendary': 2.8, 'rare': 75, 'uncommon': 15, 'common': 6 });
addRarityPercentForLayer('rare', 'figure', {'super legendary': 0, 'legendary': 0, 'rare': 0, 'uncommon': 0, 'common': 100 });
addRarityPercentForLayer('rare', 'earrings', {'super legendary': 1, 'legendary': 7, 'rare': 37, 'uncommon': 5, 'common': 50 });
addRarityPercentForLayer('rare', 'eyes', {'super legendary': 1.2, 'legendary': 2.8, 'rare': 75, 'uncommon': 15, 'common': 6 });
addRarityPercentForLayer('rare', 'nose', {'super legendary': 5, 'legendary': 10, 'rare': 0, 'uncommon': 0, 'common': 85 });
addRarityPercentForLayer('rare', 'hat', {'super legendary': 1, 'legendary': 7, 'rare': 37, 'uncommon': 5, 'common': 50 });
addRarityPercentForLayer('rare', 'glasses', {'super legendary': 1, 'legendary': 7, 'rare': 37, 'uncommon': 5, 'common': 50 });
addRarityPercentForLayer('rare', 'mouth', {'super legendary': 1.2, 'legendary': 2.8, 'rare': 75, 'uncommon': 15, 'common': 6 });

addRarityPercentForLayer('uncommon', 'background', {'super legendary': 0.8, 'legendary': 1.2, 'rare': 13, 'uncommon': 65, 'common': 20 });
addRarityPercentForLayer('uncommon', 'art', {'super legendary': 0, 'legendary': 0, 'rare': 0, 'uncommon': 100, 'common': 0 });
addRarityPercentForLayer('uncommon', 'floor', {'super legendary': 0.8, 'legendary': 1.2, 'rare': 13, 'uncommon': 75, 'common': 10 });
addRarityPercentForLayer('uncommon', 'bear', {'super legendary': 0.8, 'legendary': 1.2, 'rare': 13, 'uncommon': 75, 'common': 10 });
addRarityPercentForLayer('uncommon', 'figure', {'super legendary': 0, 'legendary': 0, 'rare': 0, 'uncommon': 0, 'common': 100 });
addRarityPercentForLayer('uncommon', 'earrings', {'super legendary': 1, 'legendary': 5, 'rare': 7, 'uncommon': 37, 'common': 50 });
addRarityPercentForLayer('uncommon', 'eyes', {'super legendary': 0.8, 'legendary': 1.2, 'rare': 13, 'uncommon': 75, 'common': 10 });
addRarityPercentForLayer('uncommon', 'nose', {'super legendary': 1, 'legendary': 4, 'rare': 0, 'uncommon': 0, 'common': 95 });
addRarityPercentForLayer('uncommon', 'hat', {'super legendary': 1, 'legendary': 5, 'rare': 7, 'uncommon': 37, 'common': 50 });
addRarityPercentForLayer('uncommon', 'glasses', {'super legendary': 1, 'legendary': 5, 'rare': 7, 'uncommon': 37, 'common': 50 });
addRarityPercentForLayer('uncommon', 'mouth', {'super legendary': 0.8, 'legendary': 1.2, 'rare': 13, 'uncommon': 75, 'common': 10 });

addRarityPercentForLayer('common', 'background', {'super legendary': 0.4, 'legendary': 0.6, 'rare': 12, 'uncommon': 23, 'common': 65 });
addRarityPercentForLayer('common', 'art', {'super legendary': 0, 'legendary': 0, 'rare': 0, 'uncommon': 100, 'common': 0 });
addRarityPercentForLayer('common', 'floor', {'super legendary': 0.4, 'legendary': 0.6, 'rare': 7, 'uncommon': 17, 'common': 75 });
addRarityPercentForLayer('common', 'bear', {'super legendary': 0.4, 'legendary': 0.6, 'rare': 7, 'uncommon': 17, 'common': 75 });
addRarityPercentForLayer('common', 'figure', {'super legendary': 0, 'legendary': 0, 'rare': 0, 'uncommon': 0, 'common': 100 });
addRarityPercentForLayer('common', 'earrings', {'super legendary': 0.1, 'legendary': 0.9, 'rare': 10, 'uncommon': 39, 'common': 50 });
addRarityPercentForLayer('common', 'eyes', {'super legendary': 0.4, 'legendary': 0.6, 'rare': 7, 'uncommon': 17, 'common': 75 });
addRarityPercentForLayer('common', 'nose', {'super legendary': 0.5, 'legendary': 1.5, 'rare': 0, 'uncommon': 0, 'common': 98 });
addRarityPercentForLayer('common', 'hat', {'super legendary': 0.1, 'legendary': 0.9, 'rare': 10, 'uncommon': 39, 'common': 50 });
addRarityPercentForLayer('common', 'glasses', {'super legendary': 0.1, 'legendary': 0.9, 'rare': 10, 'uncommon': 39, 'common': 50 });
addRarityPercentForLayer('common', 'mouth', {'super legendary': 0.4, 'legendary': 0.6, 'rare': 7, 'uncommon': 17, 'common': 75 });

module.exports = {
  layers,
  width,
  height,
  description,
  baseImageUri,
  editionSize,
  startEditionFrom,
  rarityWeights,
  generation
};
