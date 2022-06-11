const path = require('path');

module.exports = {
    "packagerConfig": {
        "name": "SVGX",
        "asar": true,
        "icon": "./src/icons/icon"
    },
    "makers": [
        {
            "name": "@electron-forge/maker-zip",
            "platforms": [
                "win32",
                "linux"
            ]
        },
        {
            "name": "@electron-forge/maker-dmg",
            "config": {
                "overwrite": true,
                "format": "ULFO"
            }
        },
        {
            "name": "@electron-forge/maker-squirrel",
            "config": {
                "overwrite": true
            }
        },
        {
            "name": "@electron-forge/maker-deb",
            "config": {
                "overwrite": true
            }
        },
        {
            "name": "@electron-forge/maker-rpm",
            "config": {
                "overwrite": true
            }
        }
    ]
}
