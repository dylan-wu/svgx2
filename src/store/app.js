import { get, writable } from "svelte/store";
import { recentsLimit } from './settings';

// Recents
function createRecents() {
    let storedRecents = JSON.parse(localStorage.getItem("recents")) || [];
    const { subscribe, set } = writable(storedRecents);

    return {
        subscribe,
        add: (file) => {
            if (file && file.fullPath) {
                const ix = storedRecents.findIndex(sr => sr.fullPath === file.fullPath);

                // The file is already in Recents, remove it so I can add it to the top of the list
                if (ix > -1) {
                    storedRecents.splice(ix, 1);
                }

                // New recent file goes over the limit; remove the oldest recent, add new file at the top
                if (storedRecents.length >= get(recentsLimit)) {
                    storedRecents.pop();
                }

                storedRecents.unshift(file); // Add it to the beginning of the list
                storedRecents = storedRecents;
                localStorage.setItem("recents", JSON.stringify(storedRecents));
                set(storedRecents)
            }
        },
        reset: () => {
            storedRecents = [];
            localStorage.setItem("recents", JSON.stringify([]));
            set([]);
        }
    };
}

export const recents = createRecents();

// Bookmarks
function createBookmarks() {
    let storedBookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const { subscribe, set } = writable(storedBookmarks);

    const isFileBookmarked = (file) => storedBookmarks.findIndex(sr => sr.fullPath === file.fullPath) > -1;

    const addFile = (file) => {
        if (file && file.fullPath && storedBookmarks.findIndex(sr => sr.fullPath === file.fullPath) === -1) {
            storedBookmarks.unshift(file);
            storedBookmarks = storedBookmarks;
            localStorage.setItem("bookmarks", JSON.stringify(storedBookmarks));
            set(storedBookmarks)
        }
    };

    const removeFile = (file) => {
        let ix = -1;
        if (file && file.fullPath) {
            ix = storedBookmarks.findIndex(sr => sr.fullPath === file.fullPath);
        }
        if (ix > -1) {
            storedBookmarks.splice(ix, 1);
            storedBookmarks = storedBookmarks;
            localStorage.setItem("bookmarks", JSON.stringify(storedBookmarks));
            set(storedBookmarks)
        }
    };

    return {
        subscribe,
        add: (file) => addFile(file),
        remove: (file) => removeFile(file),
        toggle: (file) => {
            if (isFileBookmarked(file)) {
                removeFile(file);
            } else {
                addFile(file);
            }
        },
        isBookmarked: (file) => isFileBookmarked(file) // TODO this isn't working as I would expect
    };
}

export const bookmarks = createBookmarks();

export const activeTab = writable('code'); // code | svgo | urlencoded | bgimg

// The search string used to filter files in the File Explorer
export const searchStr = writable('');
