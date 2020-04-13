//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//require

const Scene = require('Scene');
const Materials = require('Materials');
const Textures = require('Textures');
const D = require('Diagnostics');
const Patches = require('Patches');



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//Promises

let PromiseRoot = function(){
    return new Promise(resolve => {
        var promises = [];
        assetsObjects.forEach((object, i) => {
            promises.push(PromiseObject(object));
        });
        assetsPreload.materials.forEach((material, i) => {
            promises.push(PromiseMaterial(material.name));
        });
        assetsPreload.textures.forEach((texture, i) => {
            promises.push(PromiseTexture(texture));
        });
        assetsPreload.patches.forEach((patch, i) => {
            promises.push(PromisePatch(patch));
		});

        Promise.all(promises)
        .then(result => {
            resolve();
        });

    });
}

let PromiseObject = function(name) {
    return new Promise(resolve => {
        return Scene.root.findByPath('**/' + name).then(result => {
            assets['objects|' + name] = result[0];
            resolve();
        });
    });
}

let PromiseMaterial = function(name){
    return new Promise(resolve => {
        return Materials.findFirst(name).then(result => {
            assets['materials|' + name] = result;
            resolve();
        });
    });
}

let PromiseTexture = function(name){
    return new Promise(resolve => {
        return Textures.findFirst(name).then(result => {
            assets['textures|' + name] = result;
            resolve();
        });
    });
}

let PromiseProperties = function(parentName, propertyName){
    return new Promise(resolve => {
        switch(propertyName) {
            case 'material':
                return assets[parentName].getMaterial().then(result => { assets[parentName + '.' + propertyName] = result; resolve(); });
                break;
            case 'diffuse':
                return assets[parentName].getDiffuse().then(result => { assets[parentName + '.' + propertyName] = result; resolve(); });
                break;
            case 'emissive':
                return assets[parentName].getEmissive().then(result => { assets[parentName + '.' + propertyName] = result; resolve(); });
                break;
            case 'multiply':
                return assets[parentName].getMultiply().then(result => { assets[parentName + '.' + propertyName] = result; resolve(); });
                break;
            case 'reflective':
                return assets[parentName].getReflective().then(result => { assets[parentName + '.' + propertyName] = result; resolve(); });
                break;
            case 'baseColor':
                return assets[parentName].getBaseColor().then(result => { assets[parentName + '.' + propertyName] = result; resolve(); });
                break;
            case 'metallicRoughness':
                return assets[parentName].getMetallicRoughness().then(result => { assets[parentName + '.' + propertyName] = result; resolve(); });
                break;
            case 'blendShapes':
                return assets[parentName].getBlendShapes().then(result => { assets[parentName + '.' + propertyName] = result; resolve(); });
                break;
            default:
                return Promise.resolve();
        }        
    });
}

let PromisePatch = function(patch){
    return new Promise(resolve => {
        switch(patch.type) {
            case 'boolean':
                return Patches.outputs.getBoolean(patch.name).then(result => { assets['patches.' + patch.name] = result; resolve(); });
                break;
            case 'color':
                return Patches.outputs.getColor(patch.name).then(result => { assets['patches.' + patch.name] = result; resolve(); });
                break;
            case 'point':
                return Patches.outputs.getPoint(patch.name).then(result => { assets['patches.' + patch.name] = result; resolve(); });
                break;
            case 'point2D':
                return Patches.outputs.getPoint2D(patch.name).then(result => { assets['patches.' + patch.name] = result; resolve(); });
                break;
            case 'pulse':
                return Patches.outputs.getPulse(patch.name).then(result => { assets['patches.' + patch.name] = result; resolve(); });
                break;
            case 'scalar':
                return Patches.outputs.getScalar(patch.name).then(result => { assets['patches.' + patch.name] = result; resolve(); });
                break;
            case 'string':
                return Patches.outputs.getString(patch.name).then(result => { assets['patches.' + patch.name] = result; resolve(); });
                break;
            case 'vector':
                return Patches.outputs.getVector(patch.name).then(result => { assets['patches.' + patch.name] = result; resolve(); });
                break;
            default:
                return Promise.resolve();
        }        
    });
}



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//Asset Lists

let assetsPropertiesScan = function(root, obj, name) {
    var k;
    if (obj instanceof Object) {
        for (k in obj){
            if (obj.hasOwnProperty(k)){
                var newName = name + '.' + k;
                root.push(newName)
                assetsPropertiesScan(root, obj[k], newName);  
            }                
        }
    } else {
        //obj is not an instance
    };
};

let assetsPropertiesRecursivePromise = function(root, properties){
    const nextProperty = properties.shift();

    if(nextProperty){
        var nextPropertySplit = nextProperty.split('.');
        var objectName = nextPropertySplit.shift();
        var propertyName = nextPropertySplit.pop();
        var propertyParentName = nextPropertySplit.join('.');
        var parentName = root + '|' + objectName;
        if(propertyParentName != ''){
            parentName += '.' + propertyParentName;
        }

        return PromiseProperties(parentName, propertyName).then(_ => assetsPropertiesRecursivePromise(root, properties));

    }else{
        return Promise.resolve();

    }
}



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//Promise Land

var assets = {};
var assetsPreload = {};
var assetsParentName = '';
var assetsObjects = [];
var assetsObjectsProperties = [];
var assetsMaterialsProperties = [];

export const PromiseLand = (_assetsPreload) => {
	return new Promise(resolve => {
		assetsPreload = _assetsPreload;

		//build assets lists
		function recursiveChildren(array){
            var localArray = array;
			if(localArray.length == null){
				localArray = [array];
			}
			for(var i = 0; i < localArray.length; i++){
				var node = localArray[i];
		
				//add name to list
				if(assetsParentName != ''){
					assetsParentName += '/';
				}
				assetsParentName += node.name;
				assetsObjects.push(assetsParentName);
		
				//add properties
				if(node.properties){
					assetsPropertiesScan(assetsObjectsProperties, node.properties, assetsParentName);
				}
		
				//recursive
				if(node.children && node.children.length > 0){
					node.children = recursiveChildren(node.children);
				}else{
					//reset name
					assetsParentName = '';
				}
		
			}
			
            return localArray;
            
		};
		recursiveChildren(assetsPreload.objects);
		
		assetsPreload.materials.forEach((material, i) => {
			if(material.properties){
				assetsPropertiesScan(assetsMaterialsProperties, material.properties, material.name);
			}
		});

		//start promise
		PromiseRoot()
		.then(results => assetsPropertiesRecursivePromise('objects', assetsObjectsProperties))
		.then(results => assetsPropertiesRecursivePromise('materials', assetsMaterialsProperties))
		.then(results => {
			resolve(assets);
		})
		.catch(err => {
			D.log(err);
		
		});

    });
    
}



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//utils

if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;
  
      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }