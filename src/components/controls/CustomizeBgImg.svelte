<script>
  import { theme } from "../../store/settings";
  import { slide } from "svelte/transition";
  import { quintIn } from "svelte/easing";
  import BgPosition from "./BgPosition.svelte";
  import BgRepeat from "./BgRepeat.svelte";
  import BgSize from "./BgSize.svelte";
  import { bgRepeat, bgPosition, bgSize } from "../../store/svg";

  const reset = () => {
    bgRepeat.reset();
    bgPosition.reset();
    bgSize.reset();
  };
</script>

<section
  class="theme__preview-controls w-full flex flex-col p-2 border-l overflow-auto"
  style="max-width: 180px;"
  transition:slide={{ duration: 300, easing: quintIn }}>

  <div class="theme__text flex items-center justify-between font-thin text-xl">
    Customize
    <button
      type="button"
      class="border-0 bg-transparent text-svelte-orange {$theme === 'dark' ? 'hover:text-gray-400' : 'hover:text-black'}
      text-xs"
      title="Reset background"
      on:click={reset}>
      reset
    </button>

  </div>

  <div class="mt-4 space-y-4">
    <BgRepeat />

    <BgPosition />

    <BgSize />
  </div>
</section>
