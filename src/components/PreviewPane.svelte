<script>
  const ipcRenderer = require("electron").ipcRenderer;
  import { onMount } from "svelte";
  import { recents } from "../store/app";
  import { selectedFile, theme } from "../store/settings";
  import {
    svgContent,
    originalSvgContent,
    scale,
    bgColor,
    bgPosition,
    bgRepeat,
    bgSize
  } from "../store/svg";
  import { DIR_SEPARATOR, filePathToDirEnt } from "../lib/utils.js";
  import { addNamespace, encodeSvg } from "../lib/svg-utils.js";

  import BreadcrumbNav from "./BreadcrumbNav.svelte";
  import CodePane from "./CodePane.svelte";
  import SvgParseError from "./SvgParseError.svelte";
  import Controls from "./controls/PreviewControls.svelte";
  import CustomizeBgImg from "./controls/CustomizeBgImg.svelte";

  let urlEncodedSvgContent;
  let bgImageContent;
  let whichMarkup = "original"; // use the original or optimized markup for URL encoding/background-image - original, optimized
  let isCustomizeBgImgVisible = false;
  let draggingOver = false;

  const quotes = `"`;

  $: {
    urlEncodedSvgContent = encodeSvg($svgContent, "double");
    bgImageContent = `background-image: url(${quotes}data:image/svg+xml,${addNamespace(
      urlEncodedSvgContent
    )}${quotes})`;
  }

  function toggleCustomizePane() {
    isCustomizeBgImgVisible = !isCustomizeBgImgVisible;
  }

  function handleDrop(e) {
    draggingOver = false;
    const firstFile = e.dataTransfer.files[0]; // get only the first file
    if (firstFile && firstFile.path && firstFile.type === "image/svg+xml") {
      const file = filePathToDirEnt(firstFile.name, firstFile.path);

      selectedFile.set(file);

      recents.add(file);
    }
    return;
  }

  // Emit event to Main process to open the file dialog
  function openFile() {
    ipcRenderer.send("openFile");
  }

  onMount(() => {
    // Once a file was opened, convert the file path to dirent and save it to state
    ipcRenderer.on("fileSelected", (event, args) => {
      const fileName = args.selectedFile.split(DIR_SEPARATOR).pop();
      const filePath = args.selectedFile;
      const file = filePathToDirEnt(fileName, filePath);

      selectedFile.set(file);

      recents.add(file);
    });
  });
</script>

<style>

</style>

<!-- Preview pane -->
<aside class="flex-1 flex flex-col justify-center space-y-1">
  {#if $selectedFile}
    <div
      class="theme__wrapper-bg flex w-full h-full shadow overflow-hidden rounded">

      <!-- Pane -->
      <div
        class="w-full h-full flex items-center justify-center overflow-auto
        relative"
        class:transparent-backing={!$bgColor}
        style="background-color: {$bgColor}">
        <div
          id="svg-preview"
          class="svg-preview theme__svg-preview absolute inset-0"
          style={`
            background-repeat: ${$bgRepeat};
            background-size: ${$bgSize};
            background-position: ${$bgPosition};
            ${bgImageContent};
            transform: scale(${$scale});
            transform-origin: ${$scale < 1 ? 'center' : 'top left'};
          `} />
        <!-- If there are errors/exceptions parsing the SVG markup, show them here -->
        <SvgParseError />
      </div>

      <!-- Customize background-image pane -->
      {#if isCustomizeBgImgVisible}
        <CustomizeBgImg />
      {/if}

      <!-- Controls -->
      <Controls on:setComponent />
    </div>

    <BreadcrumbNav
      fileName={$selectedFile.basename}
      path={$selectedFile.fullPath}
      classes="text-xs"
      on:navigateTo />

    <!-- Code -->
    <CodePane
      on:openCustomizePane={() => (isCustomizeBgImgVisible = true)}
      on:closeCustomizePane={() => (isCustomizeBgImgVisible = false)} />
  {:else}
    <div
      class="flex items-center justify-center text-center w-full text-2xl
      text-gray-600 font-extralight h-full rounded"
      class:border-4={draggingOver}
      class:border-dashed={draggingOver}
      class:border-gray-400={draggingOver && $theme === 'light'}
      class:border-gray-700={draggingOver && $theme === 'dark'}
      class:bg-white={draggingOver && $theme === 'light'}
      class:bg-gray-900={draggingOver && $theme === 'dark'}
      on:drop|preventDefault|stopPropagation={e => handleDrop(e)}
      on:dragover|preventDefault|stopPropagation={() => {}}
      on:dragenter={() => (draggingOver = true)}
      on:dragleave={() => (draggingOver = false)}
      on:click={() => openFile()}>
      Select an SVG file, or drop one here, to get started
    </div>
  {/if}

</aside>
