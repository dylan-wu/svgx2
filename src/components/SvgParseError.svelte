<script>
  const ipcRenderer = require("electron").ipcRenderer;
  import { onMount } from "svelte";

  let show = false;
  let message = "";

  onMount(() => {
    ipcRenderer
      .on("svgParseOk", (event, args) => {
        show = false;
        message = "";
      })
      .on("svgParseError", (event, args) => {
        show = true;
        message = args.message;
      });
  });
</script>

<style>

</style>

{#if show}
  <div class="absolute bottom-0 inset-0 flex items-end">
    <!-- Message -->
    <div
      class="absolute break-words font-bold inset-x-0 p-2 text-center
      text-red-600 text-xs z-10">
      {message}
    </div>

    <!-- Transparent background; message is repeated in order to align the text & background perfectly -->
    <div
      class="absolute bg-red-200 font-bold inset-x-0 opacity-70 p-2 text-center
      text-xs">
      {message}
    </div>
  </div>
{/if}
