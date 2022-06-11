export const getSvgContent = async file => {
    if (!file) return;

    return require("fs").readFileSync(
        `${file.fullPath}`,
        "utf8"
    );
};

/**
 * Adds the xmlns if missing
 * Used for previewing SVGs that lack the ns which otherwise won't render correctly as bg-img
 *
 * @see https://yoksel.github.io/url-encoder/
 * @see https://github.com/yoksel/url-encoder/blob/master/script.js
 */
export function addNamespace(data) {
    const regx = new RegExp(/(?:%3Csvg[\w\d\s'"=:.\/-]*)(http:\/\/www.w3.org\/2000\/svg)[\w\d\s'"=:.\/-]*%3E/, 'gim');

    if (!data.match(regx)) {
        data = data.replace(/%3Csvg/g, `%3Csvg xmlns='http://www.w3.org/2000/svg'`);
    }

    return data;
}


/**
 * @see https://yoksel.github.io/url-encoder/
 * @see https://github.com/yoksel/url-encoder/blob/master/script.js
 */
export function encodeSvg(data, externalQuotesValue = 'double') {
    if (!data) return ""; // Allows working with empty SVG content

    const symbols = /[\r\n%#()<>?\[\\\]^`{|}]/g;

    // Use single quotes instead of double to avoid encoding.
    if (externalQuotesValue === 'double') {
        data = data.replace(/"/g, '\'');
    } else {
        data = data.replace(/'/g, '"');
    }

    data = data.replace(/>\s{1,}</g, "><");
    data = data.replace(/\s{2,}/g, " ");

    return data.replace(symbols, encodeURIComponent);
}

export async function getBgImgContent(file) {
    const svgContent = await getSvgContent(file);
    const urlEncodedSvgContent = encodeSvg(svgContent, "double");
    return `background-image: url("data:image/svg+xml,${addNamespace(urlEncodedSvgContent)}")`;
}

/**
 * Builds the value string for background-position
 *
 * Same x-y value for background-position seems to behave differently than other properties, 20px 20px !== 20px
 * Invalid: 20px bottom 20px
 */
export function backgroundPositionValue(xEdgeOffset = null, x = 0, xUnits = null, yEdgeOffset = null, y = 0, yUnits = null) {
    let computedXValue;
    let computedYValue;

    if (x === 0) { // value is 0
        if (xEdgeOffset) {
            computedXValue = xEdgeOffset; // show only the offset
        } else {
            computedXValue = 0; // don't show units
        }
    } else {
        if (xEdgeOffset) {
            computedXValue = `${xEdgeOffset} ${x}${xUnits}`;
        } else {
            computedXValue = `${x}${xUnits}`;
        }
    }

    // right 20px 20px ... should translate to ... right 20px
    // right 20px 0 ... should translate to ... right 20px
    if (!xEdgeOffset && yEdgeOffset) {
        computedXValue = '';
    }

    if (y === 0) { // value is 0
        if (yEdgeOffset) {
            computedYValue = yEdgeOffset; // show only the offset
        } else {
            computedYValue = 0; // don't show units
        }
    } else {
        if (yEdgeOffset) {
            computedYValue = `${yEdgeOffset} ${y}${yUnits}`;
        } else {
            computedYValue = `${y}${yUnits}`;
        }
    }

    if (xEdgeOffset && !yEdgeOffset) {
        computedYValue = '';
    }

    // 20px bottom 20px ... should translate to ... 20px bottom
    if (!xEdgeOffset && yEdgeOffset) {
        computedYValue = `${y}${yUnits} ${yEdgeOffset}`;
    }

    // Same x-y value for background-position seems to behave differently than other properties, 20px 20px !== 20px
    return `${computedXValue} ${computedYValue}`.trim();
}

/**
 * @see https://github.com/svg/svgo/blob/master/examples/test.js
 */
export async function optimizeSvg(data) {
    let dataContent = null;

    if (data) {
        // Trim the data, to better handle errors when the content is a bunch of empty spaces
        dataContent = data.trim();
    }

    if (!dataContent) throw ("Empty SVG content");

    const SVGO = require("svgo");

    const svgo = new SVGO({
        plugins: [
            {
                cleanupAttrs: true
            },
            {
                removeDoctype: true
            },
            {
                removeXMLProcInst: true
            },
            {
                removeComments: true
            },
            {
                removeMetadata: true
            },
            {
                removeTitle: true
            },
            {
                removeDesc: true
            },
            {
                removeUselessDefs: true
            },
            {
                removeEditorsNSData: true
            },
            {
                removeEmptyAttrs: true
            },
            {
                removeHiddenElems: true
            },
            {
                removeEmptyText: true
            },
            {
                removeEmptyContainers: true
            },
            {
                removeViewBox: false
            },
            {
                cleanupEnableBackground: true
            },
            {
                convertStyleToAttrs: true
            },
            {
                convertColors: true
            },
            {
                convertPathData: true
            },
            {
                convertTransform: true
            },
            {
                removeUnknownsAndDefaults: true
            },
            {
                removeNonInheritableGroupAttrs: true
            },
            {
                removeUselessStrokeAndFill: true
            },
            {
                removeUnusedNS: true
            },
            {
                cleanupIDs: true
            },
            {
                cleanupNumericValues: true
            },
            {
                moveElemsAttrsToGroup: true
            },
            {
                moveGroupAttrsToElems: true
            },
            {
                collapseGroups: true
            },
            {
                removeRasterImages: false
            },
            {
                mergePaths: true
            },
            {
                convertShapeToPath: true
            },
            {
                sortAttrs: true
            },
            {
                removeDimensions: true
            },
            {
                removeAttrs: { attrs: "(stroke|fill)" }
            }
        ]
    });

    /**
     * Delay the promise (useful for testing)
     * @see https://stackoverflow.com/a/38956175
     */
    // return svgo.optimize(data).then(result => new Promise(resolve => setTimeout(() => resolve(result), 1000)));

    return svgo.optimize(dataContent);

    // svgo.optimize(data).then(function (result) {
    //     optimizedSvgContent = result.data;
    //     console.log(result);

    //     {
    //         // optimized SVG data string
    //         data: '<svg width="10" height="20">test</svg>',
    //             // additional info such as width/height
    //         info: {
    //             width: '10',
    //             height: '20'
    //         }
    //     }
    // });
}
