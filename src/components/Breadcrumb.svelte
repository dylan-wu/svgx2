<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let breadcrumb;
</script>

<style>

</style>

<button
  type="button"
  class="text-svelte-orange"
  on:click={dispatch('navigateTo', { path: breadcrumb.path() })}>
  {breadcrumb.folderName}
</button>
