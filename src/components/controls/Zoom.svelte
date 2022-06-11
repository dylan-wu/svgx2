<script>
  const ipcRenderer = require("electron").ipcRenderer;
  import { onMount } from "svelte";
  import { scale } from "../../store/svg";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  const MIN_ZOOM = 0.1;
  const MID_ZOOM = 1;
  const MAX_ZOOM = 10;

  const zoomIn = () => {
    if ($scale >= MID_ZOOM && $scale < MAX_ZOOM) {
      $scale++;
    } else if ($scale < MID_ZOOM) {
      $scale *= 10;
      $scale++;
      $scale /= 10;
    }
  };

  const zoomOut = () => {
    if ($scale > MID_ZOOM) {
      $scale--;
    } else if ($scale > MIN_ZOOM) {
      $scale *= 10;
      $scale--;
      $scale /= 10;
    }
  };

  const zoomReset = () => scale.set(MID_ZOOM);

  onMount(() => {
    ipcRenderer
      // Zoom in
      .on("zoomIn", (event, args) => zoomIn())
      .on("zoomOut", (event, args) => zoomOut())
      .on("zoomReset", (event, args) => zoomReset());
  });
</script>

<div class="theme__control-wrapper flex flex-col items-center p-2">
  <button
    type="button"
    class="mb-1 {$scale === MAX_ZOOM ? 'theme__control-minmax' : 'text-svelte-orange'}"
    title="Zoom in"
    on:click={zoomIn}>
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
      class="feather feather-zoom-in">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="11" y1="8" x2="11" y2="14" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  </button>
  <button
    class="mb-1 font-mono text-center"
    title="Reset to 1x"
    on:click={() => zoomReset()}>
    {$scale}x
  </button>
  <button
    type="button"
    class="mb-1 {$scale === MIN_ZOOM ? 'theme__control-minmax' : 'text-svelte-orange'}"
    title="Zoom out"
    on:click={zoomOut}>
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
      class="feather feather-zoom-out">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  </button>
</div>
