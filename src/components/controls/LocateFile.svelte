<script>
  import { currentFolder, selectedFile } from "../../store/settings";
  import { getFilePath } from "../../lib/utils";
  import { createEventDispatcher } from "svelte";
  import { searchStr } from "../../store/app";

  const dispatch = createEventDispatcher();

  function locateFile() {
    const filePath = getFilePath($selectedFile);

    // check if the getFilePath exists on disk
    require("fs").exists(filePath, () => {
      // Locate the file only if it's in a different folder than the current one
      // NOTE: this still triggers a Browser refresh due to the coupled nature of activeMenu
      if (filePath !== $currentFolder) {
        currentFolder.set(filePath);
      }

      // open File Browser
      dispatch("setComponent", { component: "Browser", from: "locate" });

      // Locating a file also clears the search string
      $searchStr = "";
    });
  }
</script>

<div class="theme__control-wrapper flex flex-col items-center p-2">
  <button type="button" class="theme__add-bookmark" title="Locate this file">
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
      class="feather feather-crosshair"
      on:click|stopPropagation={() => locateFile()}>
      <circle cx="12" cy="12" r="10" />
      <line x1="22" y1="12" x2="18" y2="12" />
      <line x1="6" y1="12" x2="2" y2="12" />
      <line x1="12" y1="6" x2="12" y2="2" />
      <line x1="12" y1="22" x2="12" y2="18" />
    </svg>
  </button>
</div>
