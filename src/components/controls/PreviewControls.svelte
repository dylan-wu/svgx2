<script>
  import BgColor from "./BgColor.svelte";
  import Bookmark from "./Bookmark.svelte";
  import ClearPreview from "./ClearPreview.svelte";
  import LocateFile from "./LocateFile.svelte";
  import Zoom from "./Zoom.svelte";
  import { theme } from "../../store/settings";

  // let isExportShown = false;

  // function toggleExport(event) {
  //   isExportShown = !isExportShown;
  // }

  // function closeExport(event) {
  //   const exportBtn = document.getElementById("exportBtn");
  // }
</script>

<!-- <svelte:window on:click={closeExport} /> -->

<nav
  class="theme__preview-controls flex flex-col justify-between p-2 border-l
  text-xs">

  <div class="divide-y">
    <Bookmark />

    <Zoom />

    <BgColor />

    <LocateFile on:setComponent />
  </div>

  <div class="flex justify-center relative">
    <ClearPreview />
  </div>

</nav>
