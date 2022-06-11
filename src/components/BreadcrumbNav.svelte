<script>
  const ipcRenderer = require("electron").ipcRenderer;
  import { DIR_SEPARATOR } from "../lib/utils.js";
  import { currentFolder, theme } from "../store/settings";
  import { originalFileModified } from "../store/svg";
  import Breadcrumb from "./Breadcrumb.svelte";

  export let path;
  export let fileName = null; // Terminates in a file instead of the current folder
  export let classes = "";

  $: breadcrumbs = () => {
    const fullPath = path;
    let parts = fullPath.split(DIR_SEPARATOR);

    // Mac/Linux
    if (parts[0] === "") {
      parts.shift();
    }

    // Windows || full path contains file name at the end
    const lastItem = parts[parts.length - 1];
    if (lastItem === "" || lastItem === fileName) {
      parts.pop();
    }

    const newParts = parts.map((part, ix) => {
      return {
        path: () => {
          let p = "";

          for (let i = 0; i < ix + 1; i++) {
            if (process.platform === "win32") {
              p += `${parts[i]}${DIR_SEPARATOR}`; // Windows: slashes at the end
            } else {
              p += `${DIR_SEPARATOR}${parts[i]}`; // Mac/Linux: slashes in front
            }
          }

          // Windows: remove the trailing slash, except for C:\
          if (process.platform === "win32") {
            const regx = new RegExp(`(?<!:)\\${DIR_SEPARATOR}$`, "ig");

            return p.replace(regx, "");
          }

          return p;
        },
        folderName: part
      };
    });

    return newParts;
  };

  function revertChanges() {
    ipcRenderer.send("revertChanges");
  }
</script>

<style>

</style>

<nav
  class="theme__breadcrumb-nav flex flex-wrap items-center space-x-0.5{classes ? ' ' + classes : ''}">
  <!-- Leading slash on Mac/Linux -->
  {#if process.platform !== 'win32'}
    <span>{DIR_SEPARATOR}</span>
  {/if}

  {#each breadcrumbs() as breadcrumb}
    {#if !fileName && $currentFolder === breadcrumb.path()}
      <span class="font-bold">{breadcrumb.folderName}</span>
    {:else}
      <Breadcrumb {breadcrumb} on:navigateTo />
      <span>{DIR_SEPARATOR}</span>
    {/if}
  {/each}

  {#if fileName}
    <span class="font-bold">{fileName}</span>

    {#if $originalFileModified}
      <svg
        viewBox="0 0 15 15"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
        width="8"
        height="8"
        class="text-svelte-orange"
        title="Original file modified">
        <path d="M.5 7.5a7 7 0 1014 0 7 7 0 00-14 0z" fill="currentColor" />
      </svg>

      <button
        type="button"
        title="Revert changes"
        on:click={() => revertChanges()}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="theme__text"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" />
          <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" />
        </svg>
      </button>
    {/if}
  {/if}
</nav>
