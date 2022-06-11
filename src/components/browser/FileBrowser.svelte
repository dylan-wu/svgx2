<script>
  const ipcRenderer = require("electron").ipcRenderer;
  import { onMount } from "svelte";
  import { activeTab, recents, bookmarks, searchStr } from "../../store/app";
  import {
    currentFolder,
    selectedFile,
    theme,
    layout,
    activeMenu
  } from "../../store/settings";
  import {
    scale as zoomLevel,
    svgContent,
    originalSvgContent,
    optimizedSvgContent,
    originalFileModified,
    useOptimized
  } from "../../store/svg";
  import {
    DIR_SEPARATOR,
    userDocuments,
    getFolderContents
  } from "../../lib/utils.js";
  import { getSvgContent, optimizeSvg } from "../../lib/svg-utils.js";
  import { fly, scale } from "svelte/transition";
  import BgImg from "../BgImg.svelte";
  import BookmarkToggler from "../BookmarkToggler.svelte";
  import BreadcrumbNav from "../BreadcrumbNav.svelte";
  import LayoutControls from "./LayoutControls.svelte";
  import SearchBox from "./SearchBox.svelte";
  import Spinner from "../Spinner.svelte";

  const fs = require("fs");
  const readdirp = require("readdirp");

  $: regx = new RegExp(`${$searchStr}`, "ig");

  let folderContents = [];
  let svgCount = null;
  let count = null; // count of SVGs in current folder/search

  $: {
    if ($activeMenu.menu === "Browser") {
      folderContents = getFolderContents($currentFolder, $searchStr);

      // In Windows, system folders such as My Music, My Pictures, My Videos are symbolic links, not directories
      svgCount = folderContents.then(
        entries =>
          entries.filter(
            e => !e.dirent.isDirectory() && !e.dirent.isSymbolicLink()
          ).length
      );
    }
  }

  $: {
    if ($activeMenu.menu === "Recents") {
      folderContents = $recents.filter(file => file.basename.match(regx));
      svgCount = folderContents.length;
    }
  }

  $: {
    if ($activeMenu.menu === "Bookmarks") {
      folderContents = $bookmarks.filter(file => file.basename.match(regx));
      svgCount = folderContents.length;
    }
  }

  $: showFileBrowser = $activeMenu.visible;

  $: {
    // When a new file is selected, clear the modified flag
    originalFileModified.set(false);
    zoomLevel.set(1); // ... and reset the zoom level

    getSvgContentFromSelectedFileAndSaveToStore($selectedFile);
  }

  $: {
    // Optimize the SVG content & save it to the store
    // TODO this should be done on demand (TBD what that means)
    optimizeSvg($svgContent)
      .then(result => {
        ipcRenderer.send("svgParseOk");
        optimizedSvgContent.set(result.data);
      })
      .catch(message => {
        // Send this event to the Main process, which will then forward it to the SvgParseError component
        ipcRenderer.send("svgParseError", { message });
      });
  }

  const sortByFolder = entries => {
    if ($activeMenu.menu !== "Browser") return entries;

    return entries.sort(
      (a, b) =>
        (b.dirent.isDirectory() || b.dirent.isSymbolicLink()) -
        (a.dirent.isDirectory() || a.dirent.isSymbolicLink())
    );
  };

  const navigateToFolder = async file => {
    const folderPath = file.fullPath;

    if (
      (file.dirent.isDirectory() || file.dirent.isSymbolicLink()) &&
      fs.existsSync(folderPath)
    ) {
      currentFolder.set(folderPath);
      folderContents = getFolderContents($currentFolder, searchStr);
    }
  };

  const selectFile = file => {
    selectedFile.set(file);

    activeTab.set("code"); // Reset the active tab to Code when selecting another file

    recents.add(file);
  };

  function getSvgContentFromSelectedFileAndSaveToStore(selectedFile) {
    // Save the SVG content to the store
    getSvgContent(selectedFile)
      .then(content => {
        svgContent.set(content);
        originalSvgContent.set(content); // Store a copy of the content as "original" content; use this to determine if the content was modified
      })
      .catch(e =>
        // Send this event to the Main process, which will then forward it to the Notifier component
        ipcRenderer.send("fileMissing")
      );
  }

  onMount(() => {
    // 🔥 Watch directory for changes
    if ($activeMenu.menu === "Browser") {
      try {
        require("fs").watch($currentFolder, {}, async () => {
          $searchStr = "";
          folderContents = getFolderContents($currentFolder);
        });
      } catch (e) {
        ipcRenderer.send("needDocsFolderPermissions");
      }
    }

    // 🔥 If there's a selected file, watch it and update the Preview if its contents change
    if ($selectedFile) {
      try {
        require("fs").watch($selectedFile.fullPath, {}, async () =>
          getSvgContentFromSelectedFileAndSaveToStore($selectedFile)
        );
      } catch (e) {
        ipcRenderer.send("needDocsFolderPermissions");
      }
    }

    ipcRenderer
      // The file contents were saved so we need to reload the content
      .on("fileSaved", (event, args) => {
        getSvgContent($selectedFile).then(content => svgContent.set(content));
      });
  });
</script>

<style>
  :global(.svg-file-icon svg) {
    width: 24px;
    height: 24px;
  }
</style>

<aside
  class="theme__filebrowser mr-2 w-full shadow rounded p-2 overflow-hidden"
  class:hidden={!showFileBrowser}
  transition:scale={{ duration: 150, start: 1, opacity: 0 }}>

  {#if $activeMenu.menu === 'Browser'}
    <BreadcrumbNav path={$currentFolder} classes="text-xs" on:navigateTo />
  {:else}
    <h2 class="flex items-center justify-between font-thin text-3xl">
      {$activeMenu.menu}
      {#if $activeMenu.menu === 'Recents'}
        <button class="btn--xs" on:click={() => recents.reset()}>
          Clear recents
        </button>
      {/if}
    </h2>
  {/if}

  <div class="flex flex-col my-2 relative">
    <!-- Search box -->
    <SearchBox />

    <!-- Layout controls -->
    <LayoutControls {svgCount} />
  </div>

  <div id="scrollArea" class="content-wrapper overflow-auto p-1 pb-4">
    {#await folderContents}
      <div class="flex flex-col items-center justify-center h-full">
        <Spinner size={32} />
      </div>
    {:then entries}
      {#if entries.length}
        <div class={`layout--${$layout}`}>
          {#each sortByFolder(entries) as file, index (index)}
            {#if $activeMenu.menu === 'Browser' && (file.dirent.isDirectory() || file.dirent.isSymbolicLink())}
              <button
                type="button"
                title={file.fullPath}
                class="theme__folder-btn flex items-center w-full p-2 rounded"
                style="word-break: break-all"
                on:click={navigateToFolder(file)}>
                <div class="">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="currentColor"
                    stroke-width="0"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="theme__folder-svg feather feather-folder">
                    <path
                      d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1
                      2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div class="text-xs leading-3">{file.basename}</div>
              </button>
            {:else}
              <div class="relative group">
                <BookmarkToggler {file} layout={$layout} />

                <button
                  type="button"
                  title={file.fullPath}
                  class="theme__file-btn flex items-center w-full p-2 rounded"
                  class:theme__file-selected={$selectedFile && `${file.fullPath}` === `${$selectedFile.fullPath}`}
                  style="word-break: break-all"
                  on:click={() => selectFile(file)}>

                  <BgImg {file} {index} size="sm" />

                  <div class="text-xs leading-3">
                    {file.basename.replace(/.svg$/gi, '')}
                  </div>
                </button>
              </div>
            {/if}
          {/each}
        </div>
      {:else}
        <div
          class="flex items-center justify-center h-full text-gray-600 text-3xl
          font-thin">
          no results
        </div>
      {/if}
    {/await}
  </div>

</aside>
