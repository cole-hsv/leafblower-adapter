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
            var part = util.group();

            part.add(util.poly2solid(
                    CAG.circle({
                        radius: 57.9 / 2
                    }),
                    CAG.circle({
                        radius: 58.4 / 2
                    }),
                    38.1)
                // .chamfer(2, 'z+')
                .color('gold'), 'neck');

            part.add(util.poly2solid(
                    CAG.roundedRectangle({
                        radius: [45, 45],
                        roundradius: 10
                    }),
                    CAG.roundedRectangle({
                        radius: [48, 48],
                        roundradius: 10
                    }),
                    10
                )
                .chamfer(2, 'z+')
                .snap(part.parts.neck, 'z', 'outside+')
                .color('gold'), 'base');

            return part;
        },
        collar: function collar() {
            var part = util.group();

            var drain = [58.08, 78.12].map(x => x / 2);
            var drainRoundRadius = 15;
            part.add(util.poly2solid(
                    CAG.roundedRectangle({
                        radius: drain,
                        roundradius: drainRoundRadius
                    }).enlarge([-1, -1, 0]),
                    CAG.roundedRectangle({
                        radius: drain,
                        roundradius: drainRoundRadius
                    }),
                    38
                )
                .chamfer(2, 'z+')
                // .snap(part.parts.neck, 'z', 'outside+')
                .color('darkgreen'), 'collar');

            part.add(
                CAG.roundedRectangle({
                    radius: drain,
                    roundradius: drainRoundRadius
                }).enlarge([8, 8, 0])
                .extrude({
                    offset: [0, 0, 5]
                })

                .color('darkgreen'), 'base');

            part.holes = Parts.Cylinder(2, drain[1] * 2 + 10)
                .rotateX(90)
                .align(part.parts.collar, 'xyz')
                .color('red');

            return part;
        },
        assembled: function assembled() {
            return union([parts.leafblower().combine(), parts.collar().combine()]);
        },
        adapter: function adapter() {
            var collar = parts.collar();
            return collar.combine().subtract(parts.leafblower().parts.neck.enlarge([1, 1, 0]));
        }
    };

    return parts['adapter']();

}

// ********************************************************
// Other jscad libraries are injected here.  Do not remove.
// Install jscad libraries using NPM
// ********************************************************
// include:js
// endinject
