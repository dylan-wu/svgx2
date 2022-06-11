import { readable, writable } from "svelte/store";
import { userDocuments } from "../lib/utils.js";

export const appName = readable('SVGX');
export const contact = {
    'www': 'https://svgx.app',
    'email': 'svgx@protonmail.com',
    'authorTwitter': 'brbcoding',
    'appTwitter': 'svgxapp',
    'gumroadLink': 'https://gumroad.com/l/svgx-source',
};

// Active menu
const init = {
    "menu": "Browser",
    "visible": true
}
const storedActiveMenu = JSON.parse(localStorage.getItem("activeMenu")) || init;
export const activeMenu = writable(storedActiveMenu ? storedActiveMenu : init);
activeMenu.subscribe(value => {
    localStorage.setItem("activeMenu", JSON.stringify(value));
});

// Current folder
const storedCurrentFolder = localStorage.getItem("currentFolder");
export const currentFolder = writable(storedCurrentFolder ? storedCurrentFolder : userDocuments);
currentFolder.subscribe(value => {
    localStorage.setItem("currentFolder", value);
});

// Selected file
const storedSelectedFile = JSON.parse(localStorage.getItem("selectedFile"));
export const selectedFile = writable(storedSelectedFile ? storedSelectedFile : null);
selectedFile.subscribe(value => {
    localStorage.setItem("selectedFile", JSON.stringify(value));
});

// Theme
const storedTheme = localStorage.getItem("theme") || 'light';
export const theme = writable(storedTheme);
theme.subscribe(value => {
    localStorage.setItem("theme", value === 'dark' ? 'dark' : 'light');
});

//  Layout
const storedLayout = localStorage.getItem("layout");
export const layout = writable(storedLayout);
layout.subscribe(value => {
    localStorage.setItem("layout", value === 'grid' ? 'grid' : 'list');
});

// Recents limit (maximum # of files that can be in Recents)
export const defaultRecentsLimit = 20;
const storedRecentsLimit = parseInt(localStorage.getItem("recentsLimit"), 10);
export const recentsLimit = writable(storedRecentsLimit ? storedRecentsLimit : defaultRecentsLimit);
recentsLimit.subscribe(value => {
    localStorage.setItem("recentsLimit", parseInt(value, 10));
});
