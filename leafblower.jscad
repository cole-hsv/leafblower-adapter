// title      : leafblower
// author     : John Cole
// license    : ISC License
// file       : leafblower.jscad

/* exported main, getParameterDefinitions */

function getParameterDefinitions() {
    var parts = {
        collar: 'collar',
        leafblower: 'leafblower',
        adapter: 'adapter',
        nozzel: 'nozzel',
        assembled: 'assembled'
    };

    return [{
        name: 'resolution',
        type: 'choice',
        values: [0, 1, 2, 3, 4],
        captions: ['very low (6,16)', 'low (8,24)', 'normal (12,32)', 'high (24,64)', 'very high (48,128)'],
        initial: 0,
        caption: 'Resolution:'
    }, {
        name: 'part',
        type: 'choice',
        values: Object.keys(parts),
        captions: Object.keys(parts).map(function (key) {
            return parts[key];
        }),
        initial: 'nozzel',
        caption: 'Part:'
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

    var drain = [58.08, 75].map(x => x / 2);
    var drainRoundRadius = 15;

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
                // .chamfer(2, 'z+')
                // .snap(part.parts.neck, 'z', 'outside+')
                .color('green'), 'collar');

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
        adapter: function adapter() {
            var collar = parts.collar();
            return collar.combine().subtract(parts.leafblower().parts.neck.enlarge([1, 1, 0]));
        },
        nozzel: function adapter() {
            var length = util.inch(3);
            var collar = parts.collar();
            var collarbase = collar.parts.base
                .enlarge(2, 2, -2.5)
                .snap(collar.parts.collar, 'z', 'inside-');

            var nozzelbase = collarbase
                .snap(collar.parts.base, 'z', 'outside+')
                .color('blue')

            var nozzel = util.poly2solid(
                    CAG.roundedRectangle({
                        radius: drain,
                        roundradius: drainRoundRadius
                    }),
                    CAG.roundedRectangle({
                        radius: util.inch(0.5),
                        roundradius: util.inch(1)
                    }),
                    length)
                .snap(collarbase, 'z', 'outside+').color('lightblue');

            var hole = Parts.Cylinder(util.inch(1.25), util.inch(2.5))
                .align(nozzel, 'xyz')
                .color('red');


            return union([
              collar.parts.collar,
              collarbase,
              nozzelbase,
              nozzel,
              // hole
            ])
                .subtract([
              collar.parts.collar.enlarge(-2, -2, 0),
              nozzel.enlarge(-2, -2, 0),
              collar.holes
            ]);
        },
        assembled: function assembled() {
            return union([parts.leafblower().combine(), parts.collar().combine()]);
        }
    };

    var part = parts[params.part]();
    return part.combine ? part.combine() : part;
}

// ********************************************************
// Other jscad libraries are injected here.  Do not remove.
// Install jscad libraries using NPM
// ********************************************************
// include:js
// endinject
