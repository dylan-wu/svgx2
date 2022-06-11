<script>
  import { activeTab } from "../../store/app";
  import { selectedFile, theme } from "../../store/settings";
  import { svgContent, optimizedSvgContent } from "../../store/svg";
  import ClickOutside from "svelte-click-outside";
  import html2canvas from "html2canvas";

  const { ipcRenderer } = require("electron");

  let show = false;
  let triggerEl; // the "Export" button

  const downloadIcon = `<svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-download mr-1">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />`;

  // Inform the Main process that the file is ready + pass the file content to it
  async function exportAs(type) {
    const path = require("path");
    show = false;
    let imgContent = null;

    if (!$svgContent) return;

    // Get the selected SVG file name
    let fileName = $selectedFile.basename;
    // Strip the "svg" extension from the full file path, we will decide later what extension it will have based on "type"
    const extension = path.extname($selectedFile.fullPath);
    fileName = fileName.replace(extension, "");
    const filePath = path.dirname($selectedFile.fullPath);

    // For SVGs assign the raw SVG content
    if (type === "svg") {
      // Export the optimized markup if on the Optimized tab...
      if ($activeTab === "svgo") {
        imgContent = $optimizedSvgContent;
        fileName = fileName + "-optimized";
      }
      // ...otherwise export the raw SVG markup
      else {
        imgContent = $svgContent;
      }
    }

    // For PNGs we need more prep
    if (type === "png") {
      const canvas = await prepareImageForExportAsPng();

      if (canvas) {
        imgContent = canvas
          .toDataURL("image/png")
          .replace(/^data:image\/png;base64,/, "");
      }
    }

    // Add the extension for the "type" we want to export as
    fileName = fileName + `.${type}`;

    // Send the file back to the background process
    if (imgContent) {
      ipcRenderer.send("imageAvailableForExport", {
        fileName,
        filePath,
        type,
        imgContent
      });
    }

    return;
  }

  // Convert the rendered html to canvas
  async function prepareImageForExportAsPng() {
    // Grab the rendered image
    const canvas = await html2canvas(document.querySelector("#svg-preview"));

    return canvas;
  }
</script>

<div class="relative">
  <button
    type="button"
    id="export"
    class="btn--xs flex items-center leading-tight py-1 mx-1"
    title="Export to various formats"
    bind:this={triggerEl}
    on:click={() => (show = !show)}>
    {@html downloadIcon}
    Export
  </button>

  <ClickOutside on:clickoutside={() => (show = false)} exclude={[triggerEl]}>
    <div class="absolute w-36 shadow rounded" class:hidden={!show}>
      <button
        type="button"
        class="theme__tab-btn theme__text w-full flex items-center p-2 space-x-2
        rounded-t"
        on:click={() => exportAs('svg')}>
        {@html downloadIcon}
        <span>
          .SVG
          {#if $activeTab === 'svgo'}optimized{/if}
        </span>
      </button>
      <button
        type="button"
        class="theme__tab-btn theme__text w-full flex items-center p-2 space-x-2
        rounded-b"
        on:click={() => exportAs('png')}>
        {@html downloadIcon}
        <span>.PNG</span>
      </button>
    </div>
  </ClickOutside>
</div>
