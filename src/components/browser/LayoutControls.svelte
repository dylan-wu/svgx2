<script>
  import { layout } from "../../store/settings";

  export let svgCount;
</script>

<style>

</style>

<div
  class="theme__subtle-border flex items-center justify-between w-full border-b
  py-3 px-2">

  <div class="theme__svg-btn text-xs font-thin">
    {#await svgCount}
      &hellip;
    {:then count}
      {#if count}
        <span class="font-bold">{count}</span>
        SVG{count === 1 ? '' : 's'}
      {/if}
    {/await}
  </div>

  <div class="flex">
    <!-- Grid -->
    <button
      type="button"
      title="Grid view"
      class="theme__svg-btn flex flex-col items-center px-2{$layout === 'grid' ? ' selected' : ''}"
      on:click={() => layout.set('grid')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width="16"
        height="16"
        fill="currentColor"
        class="mb-1">
        <path
          d="M0 0h9v9H0V0zm2 2v5h5V2H2zm-2 9h9v9H0v-9zm2
          2v5h5v-5H2zm9-13h9v9h-9V0zm2 2v5h5V2h-5zm-2 9h9v9h-9v-9zm2
          2v5h5v-5h-5z" />
      </svg>
    </button>

    <!-- List -->
    <button
      type="button"
      title="List view"
      class="theme__svg-btn flex flex-col items-center px-2{$layout === 'list' ? ' selected' : ''}"
      on:click={() => layout.set('list')}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        width="16"
        height="16"
        fill="currentColor"
        class="mb-1">
        <path d="M0 3h20v2H0V3zm0 4h20v2H0V7zm0 4h20v2H0v-2zm0 4h20v2H0v-2z" />
      </svg>
    </button>
  </div>
</div>
