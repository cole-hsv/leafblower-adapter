// title      : leafblower
// author     : John Cole
// license    : ISC License
// file       : leafblower.jscad

/* exported main, getParameterDefinitions */

function getParameterDefinitions() {

    return [{
        name: 'resolution',
        type: 'choice',
        values: [0, 1, 2, 3, 4],
        captions: ['very low (6,16)', 'low (8,24)', 'normal (12,32)', 'high (24,64)', 'very high (48,128)'],
        initial: 2,
        caption: 'Resolution:'
    }];
}

function main(params) {

    var resolutions = [
        [6, 16],
        [8, 24],
        [12, 32],
        [24, 64],
        [48, 128]
    ];
    CSG.defaultResolution3D = resolutions[params.resolution][0];
    CSG.defaultResolution2D = resolutions[params.resolution][1];
    util.init(CSG);

    var parts = {
        leafblower: function () {
            var leafblower = util.group();

            leafblower.add(Parts.Tube(85, 59, 2.5)
                .color('gold'), 'base');
            leafblower.add(Parts.Tube(76.4, 59, 38)
                .snap(leafblower.parts.base, 'z', 'outside-')
                .color('gray'), 'neck');


            return leafblower.combine();
        }
    }

    return parts['leafblower']();

}

// ********************************************************
// Other jscad libraries are injected here.  Do not remove.
// Install jscad libraries using NPM
// ********************************************************
// include:js
// endinject
