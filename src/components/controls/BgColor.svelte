<script>
  import { theme } from "../../store/settings";
  import { bgColor } from "../../store/svg";

  import Huebee from "huebee";
  import { createEventDispatcher, onMount } from "svelte";

  const dispatch = createEventDispatcher();

  let hueb;

  function initHuebeeAction(node, params) {
    hueb = new Huebee(node, {
      notation: "hex",
      saturations: 1,
      // customColors: ["#C25", "#E62", "#EA0", "#19F", "#333"],
      setText: false,
      className: `huebee-custom ${$theme}-picker`
    });

    hueb.on("change", function(color) {
      bgColor.set(color);
    });
  }

  function reset() {
    hueb.setColor("rgba(255, 255, 255, 0)");
    bgColor.set(null);
  }
</script>

<style>
  :global(.huebee.huebee-custom .huebee__container) {
    left: -200px;
  }
  :global(.huebee.huebee-custom.dark-picker .huebee__container) {
    background: #1a202c; /* gray-900 */
  }

  :global(.huebee.huebee-custom.light-picker .huebee__container) {
    background: #f8f8f8;
  }
</style>

<div class="theme__control-wrapper flex flex-col items-center p-2">
  <div class="theme__color-picker-wrapper rounded border">
    <div
      id="bg-color"
      class="{$bgColor ? '' : 'transparent-backing '} overflow-hidden rounded
      w-8 h-8 {`${$theme}-picker`}"
      style="background-color: {$bgColor}"
      use:initHuebeeAction>
      &nbsp;
    </div>
  </div>

  <button
    type="button"
    class="border-0 bg-transparent text-svelte-orange mt-2"
    class:hover:text-gray-400={$theme === 'dark'}
    class:hover:text-black={$theme !== 'dark'}
    title="Reset preview background"
    on:click={reset}>
    reset
  </button>

</div>
