export const IS_DEMO = process.env.DEMO === 'yes' ? true : false; // demo version of the app
export const IS_FULL = !IS_DEMO; // full version

function getUserHome() {
    return process.env[process.platform === "win32" ? "USERPROFILE" : "HOME"];
}

export const DIR_SEPARATOR = process.platform === "win32" ? "\\" : "/";

export const userDocuments = require('path').join(getUserHome(), "Documents");

export function getFolderContents(folder, searchStr = null) {
    return require("readdirp").promise(folder, {
        fileFilter: [`*${searchStr ? `${searchStr}*` : ``}.svg`],
        depth: searchStr ? 5 : 0,
        type: searchStr ? 'files' : 'files_directories',
        alwaysStat: false
    });
}

/**
 * Takes a full file path (~selectedFile) and returns the folder path (~ currentFolder) of the file
 * Useful for locating it in the file structure
 */
// TODO might have to implement the technique used in BreadcrumbNav for x-platform functionality
// TODO use const filePath = path.dirname($selectedFile.fullPath); instead???
export function getFilePath(file) {
    if (file && file.fullPath) {
        const fullPath = file.fullPath; // "/Users/cemitas/Documents/_icons/zondicons/box.svg"
        const folderSegments = fullPath.split(DIR_SEPARATOR); // ["", "Users", "cemitas", "Documents", "_icons", "zondicons", "box.svg"]
        folderSegments.pop(); // ["", "Users", "cemitas", "Documents", "_icons", "zondicons"]

        return folderSegments.join(DIR_SEPARATOR);
    }
}

/**
 * @see https://github.com/alpinejs/alpine/blob/master/src/utils.js
 */
export function debounce(func, wait) {
    var timeout
    return function () {
        var context = this, args = arguments
        var later = function () {
            timeout = null
            func.apply(context, args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

// Is the menu item part of the "Files" group?
export function isFiles(currentMenu) {
    return ["Browser", "Recents", "Bookmarks"].indexOf(currentMenu) > -1;
}

// Workaround to convert a file path (such as a dropped or openeed file) to a dirent object
// Basicalle replicating the dirent JSON structure
export function filePathToDirEnt(fileName, filePath) {
    return {
        path: fileName,
        fullPath: filePath,
        basename: fileName,
        dirent: {
            name: fileName
        }
    };
}
