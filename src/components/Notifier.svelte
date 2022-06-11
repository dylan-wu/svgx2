<script>
  const ipcRenderer = require("electron").ipcRenderer;
  import Snackbar from "./Snackbar.svelte";
  import { onMount } from "svelte";

  let snackbarMsg = "";
  let snackbarVisible = false;

  onMount(() => {
    ipcRenderer
      .on("markupCopied", (event, args) => {
        snackbarMsg = "Copied to clipboard";
        snackbarVisible = true;
      })
      .on("innerMarkupCopied", (event, args) => {
        snackbarMsg = "Copied inner markup to clipboard";
        snackbarVisible = true;
      })
      .on("fileExported", (event, args) => {
        snackbarMsg = "File exported";
        snackbarVisible = true;
      })
      .on("fileSaved", (event, args) => {
        snackbarMsg = "File saved";
        snackbarVisible = true;
      })
      .on("fileMissing", (event, args) => {
        snackbarMsg =
          "The selected file is missing - it may have been moved, renamed, or deleted";
        snackbarVisible = true;
      });
  });
</script>

<style>

</style>

<Snackbar
  bind:visible={snackbarVisible}
  bottom={true}
  timeout={2}
  textColor="text-gray-100"
  bgColor="bg-gray-700">
  {snackbarMsg}
  <span slot="action">
    <button
      type="button"
      class="p-2 underline"
      on:click={() => {
        snackbarVisible = false;
        snackbarMsg = undefined;
      }}>
      Close
    </button>
  </span>
</Snackbar>
