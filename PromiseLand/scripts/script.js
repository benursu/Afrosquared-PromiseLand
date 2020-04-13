//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
// Promise Land
// @afrosquared | Ben Ursu
// Instagram | Spark AR Studio | SDK v85.0



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//require

const Scene = require('Scene');
const R = require('Reactive');
const D = require('Diagnostics');
const Time = require('Time');
const Materials = require('Materials');
const Textures = require('Textures');
const Patches = require('Patches');

import { PromiseLand } from './PromiseLand';



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//Promise Land Assets

var promiseLandAssets = {
    objects: [
        {
            name: 'items'
        },
        {
            name: 'grandparent',
            children: [
                {
                    name: 'parent',
                    children: [
                        {
                            name: 'child',
                            children: [
                                {
                                    name: 'irisHigh',
                                    children: [
                                        {
                                            name: 'Torus',
                                            properties: {
                                                material: { 
                                                    diffuse: {},
                                                    emissive: {},
                                                    reflective: {}
                                                },
                                                blendShapes: {}
                                            }
                                        }
                                    ] 
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    materials: [
        {
            name: 'material0'
        },
        {
            name: 'material1',
            properties: {
                emissive: {},
                reflective: {}
            }
        },
        {
            name: 'material2',
            properties: {
                baseColor: {},
                metallicRoughness: {}
            }
        }
    ],
    textures: [
        'texture0',
        'texture1'
    ],
    patches: [
        { name: 'boolean', type: 'boolean' },
        // { name: 'color', type: 'color' },
        // { name: 'point', type: 'point' },
        // { name: 'point2D', type: 'point2D' },
        // { name: 'pulse', type: 'pulse' },
        // { name: 'scalar', type: 'scalar' },
        { name: 'string', type: 'string' },
        // { name: 'vector', type: 'vector' }
    ]
};


//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//Promise Land Assets Dynamic Names

//find element
// let grandParentParent = promiseLandAssets['objects'].find(el => el.name === "grandparent").children.find(el => el.name === "parent");

//add more items to asset list before promising
let items = promiseLandAssets['objects'].find(el => el.name === "items");
if(items.children == null){
    items.children = [];
}
for(var i = 0; i < 4; i++){
    items.children.push({ name: 'item' + i });
}



//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////
//Promise Land

var assets = {};

PromiseLand(promiseLandAssets).then(_assets => {
    assets = _assets;

    //ready!
    init();

}).catch(err => {
    D.log(err);
  
});

function init(){
    //examples
    //uncomment one to see log

    // D.log(assets['materials|material0']);
    // D.log(assets['materials|material0.emissive']);
    // D.log(assets['materials|material2.baseColor']);

    // D.log(assets['objects|items/item0']);

    // D.log(assets['objects|grandparent/parent/child/irisHigh']);
    // D.log(assets['objects|grandparent/parent/child/irisHigh/Torus.material']);
    // D.log(assets['objects|grandparent/parent/child/irisHigh/Torus.material.diffuse']);
    // D.log(assets['objects|grandparent/parent/child/irisHigh/Torus.material.emissive']);
    // D.log(assets['objects|grandparent/parent/child/irisHigh/Torus.material.reflective']);
    // assets['objects|grandparent/parent/child/irisHigh/Torus.blendShapes'].forEach((blendShape, i) => { D.log(blendShape); });

    // assets['objects|grandparent/parent/child/irisHigh/Torus.blendShapes'].forEach((blendShape, i) => {
    // 	if(blendShape.name == 'Torus'){
    // 		blendShape.weight = R.val(0);
    // 	}
    // });

    // D.log(assets['patches.boolean']);
    // D.log(assets['patches.string']);

    // assets['patches.boolean'].monitor().subscribe(function(e) {
    //     D.log('patches.boolean: ' + e.newValue);
    // });

    D.log('done!');

}
