import { writable } from "svelte/store";

// SVG content - changes whenever a file is selected, or when the SVG content is modified
function createSvgContent() {
    const { subscribe, set } = writable(null);

    return { subscribe, set }
}
export const svgContent = createSvgContent();

// Original SVG content -
function createOriginalSvgContent() {
    const { subscribe, set } = writable(null);

    return { subscribe, set }
}
export const originalSvgContent = createOriginalSvgContent();

// Becomes true when the SVG is edited, and the diverges from the original content
export const originalFileModified = writable(false);

// Optimized SVG content - changes when the SVG content changes
export const optimizedSvgContent = writable(null);

// Zoom scale
export const scale = writable(1);

// Background color selector
export const bgColor = writable(null);

// Background image repeat
const defaultBgRepeat = "no-repeat";
function createBgRepeat() {
    const { subscribe, set } = writable(defaultBgRepeat);

    return {
        subscribe,
        set,
        reset: () => {
            set(defaultBgRepeat)
        }
    };
}
export const bgRepeat = createBgRepeat();

// Background position
const defaultBgPosition = "center";
function createBgPosition() {
    const { subscribe, set } = writable(defaultBgPosition);

    return {
        subscribe,
        set,
        reset: () => {
            set(defaultBgPosition)
        }
    };
}
export const bgPosition = createBgPosition();

// Background size
const defaultBgSize = "contain";
function createBgSize() {
    const { subscribe, set } = writable(defaultBgSize);

    return {
        subscribe,
        set,
        reset: () => {
            set(defaultBgSize)
        }
    };
}
export const bgSize = createBgSize();

// Use original or optimized code?
export const useOptimized = writable(false);
