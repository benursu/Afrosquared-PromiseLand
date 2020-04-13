# Promise Land

## Spark AR Promise Library
A promise libary for Spark AR Studio v85.  Still lots do but this is a first stab.

## Usage

### Import

```
import { PromiseLand } from './PromiseLand';
```

### Config

```
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
        { name: 'color', type: 'color' },
        { name: 'point', type: 'point' },
        { name: 'point2D', type: 'point2D' },
        { name: 'pulse', type: 'pulse' },
        { name: 'scalar', type: 'scalar' },
        { name: 'string', type: 'string' },
        { name: 'vector', type: 'vector' }
    ]
};
```

### Init

```
var assets = {};

PromiseLand(promiseLandAssets).then(_assets => {
    assets = _assets;

    //ready!
    init();

}).catch(err => {
    D.log(err);
  
});

function init(){
    D.log('done!');
}
```

### Assets

Examples of how to access.  Key is in format of ['type|path/path.property.property'].

```
assets['materials|material0']
assets['materials|material0.emissive']
assets['objects|items/item0']
assets['objects|grandparent/parent/child/irisHigh/Torus.material']
assets['objects|grandparent/parent/child/irisHigh/Torus.material.diffuse']
assets['patches.boolean']
```
