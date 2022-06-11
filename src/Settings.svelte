<script>
  import { defaultRecentsLimit, recentsLimit, theme } from "./store/settings";
  import { fade } from "svelte/transition";

  let message = null;

  // Note: can also bind the input directly to $recentsLimit which causes it to auto-update in the store on change
  $: newRecentsLimit = $recentsLimit;

  function saveSettings() {
    recentsLimit.set(newRecentsLimit);

    message = "Settings saved";
    setTimeout(() => (message = null), 2000);
  }
</script>

<style>

</style>

<div class="theme__text h-full flex overflow-auto">
  <div class="w-full space-y-2">
    <h2 class="font-thin text-3xl">Settings</h2>

    <div
      class="theme__bg w-full flex flex-col items-end max-w-2xl mx-auto mb-4 p-2
      space-y-4 rounded shadow">

      <div class="w-full flex flex-row items-center">
        <div class="w-1/2 flex flex-col pr-2 text-right">
          <label class="">
            Maximum files in
            <strong>Recents</strong>
          </label>
          <em class="text-xs text-gray-600">
            A large number may affect performance
          </em>
        </div>
        <div class="w-1/2 pl-2">
          <input
            type="number"
            min="1"
            bind:value={newRecentsLimit}
            class="theme__tab-btn w-14 px-2 py-1 bg-gray-300 {$theme}:bg-gray-700
            border border-gray-400 {$theme}:border-gray-600 rounded" />
          (default
          <strong>{defaultRecentsLimit}</strong>
          )
        </div>
      </div>

      <div>
        {#if message}
          <span
            out:fade={{ delay: 250, duration: 300 }}
            class="mr-2 text-gray-600">
            {message}
          </span>
        {/if}

        <button type="button" class="btn--sm" on:click={saveSettings}>
          Save
        </button>
      </div>

    </div>

  </div>
</div>
