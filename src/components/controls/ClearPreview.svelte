<script>
  import { selectedFile } from "../../store/settings";
  import { bgColor, scale as zoomLevel } from "../../store/svg";
</script>

<div class="theme__control-wrapper flex flex-col items-center">
  <button
    class="btn--xs"
    on:click={() => {
      selectedFile.set(null);
      zoomLevel.set(1);
      bgColor.set(null);
    }}
    title="Clear preview">
    Clear
  </button>
</div>
