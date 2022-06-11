<script>
  const ipcRenderer = require("electron").ipcRenderer;
  import { tick } from "svelte";
  import { searchStr } from "../../store/app";
  import { currentFolder, activeMenu, theme } from "../../store/settings";
  import { DIR_SEPARATOR, debounce } from "../../lib/utils.js";

  let thisFolder;
  let searchInput;

  $: {
    if ($activeMenu.menu === "Browser") {
      thisFolder = $currentFolder
        ? $currentFolder
            .split(DIR_SEPARATOR)
            .reverse()
            .shift()
        : ""; // actual current folder (last segment), not full path
    } else {
      thisFolder = $activeMenu.menu;
    }
  }

  const onInput = debounce(event => {
    $searchStr = event.target.value;
  }, 250);

  // Handle typing Esc - clear the search
  function handleEscAction(node, params) {
    ipcRenderer.on("escape", (event, args) => {
      resetSearch();
    });
  }

  function resetSearch() {
    // Prevent "Cannot set property 'value' of null" error when hitting ESC after navigating to another menu
    // Prevent clearing the search outside the File Browser / Recents / Bookmarks
    if (
      searchInput &&
      ["Browser", "Recents", "Bookmarks"].findIndex(
        i => i === $activeMenu.menu
      ) > -1
    ) {
      $searchStr = "";
      searchInput.value = "";
      searchInput.blur();
    }
  }

  async function registerEvents(event) {
    // Don't trigger the hotkey when editing the raw SVG markup
    if (event.code === "Slash" && event.target.id === "rawMarkup") return;

    switch (event.code) {
      case "Slash":
        // Typing slash "/" always opens the File Browser
        const { menu, visible } = { ...$activeMenu };
        activeMenu.set({
          menu,
          visible: true
        });
        await tick(); // Give time for the searchInput to render

        searchInput.focus();
        break;
      default:
        break;
    }
  }
</script>

<style>

</style>

<svelte:window on:keyup={registerEvents} />
<div class="flex items-center">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="theme__search-icon feather feather-search absolute ml-2">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
  <input
    type="text"
    bind:this={searchInput}
    bind:value={$searchStr}
    class="theme__search-input py-1 px-8 rounded w-full border"
    placeholder={`"/" to search ${thisFolder}`}
    on:input={e => onInput(e)}
    use:handleEscAction />

  {#if $searchStr}
    <button
      type="button"
      class="theme__svg-btn flex items-center group-hover:{$theme === 'dark' ? 'text-white' : 'text-black'}"
      title="Clear the search"
      on:click={() => resetSearch()}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-x absolute right-0 mr-2">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  {/if}
</div>
