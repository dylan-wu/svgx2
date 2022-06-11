<script>
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let externalQuotes;

  $: {
    dispatch("setExternalQuotes", { externalQuotes });
  }
</script>

<div class="theme__text flex flex-col">
  <span class="font-bold" title="External quotes">External quotes</span>

  <div class="flex items-center space-x-4">
    <label class="">
      <input type="radio" bind:group={externalQuotes} value="double" />
      <span class="text-2xl font-serif leading-6" style="vertical-align: sub;">
        &quot;
      </span>
    </label>
    <label class="">
      <input type="radio" bind:group={externalQuotes} value="single" />
      <span class="text-2xl font-serif leading-6" style="vertical-align: sub;">
        &apos;
      </span>
    </label>
  </div>
</div>
