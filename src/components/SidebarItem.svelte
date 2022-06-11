<script>
  import { createEventDispatcher } from "svelte";
  import { activeMenu } from "../store/settings";
  import { isFiles } from "../lib/utils";

  export let label;
  export let title;

  const dispatch = createEventDispatcher();

  $: selected = () =>
    // either one of the "Files" group of visible menu items
    (isFiles($activeMenu.menu) &&
      $activeMenu.menu === label &&
      $activeMenu.visible) ||
    // or one of the "pages", regardless of visibility
    (!isFiles($activeMenu.menu) && $activeMenu.menu === label);
</script>

<style>

</style>

<button
  type="button"
  {title}
  class="flex flex-col items-center w-full py-4 border-l-4"
  class:selected={selected()}
  on:click={() => dispatch('setComponent', { component: label })}>

  <!-- Icon -->
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round">
    <slot />
  </svg>

  <!-- <div class="uppercase text-xs font-light">{label}</div> -->
</button>
