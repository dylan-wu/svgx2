<script>
  import { bookmarks } from "../store/app";
  import { theme, selectedFile } from "../store/settings";

  export let file;
  export let size = 16;
  export let layout = "grid"; // assume a grid layout by default, this helps in Bookmarks
  export let absolute = true; // position it absolutely?

  $: isBookmarked = file =>
    file &&
    file.fullPath &&
    $bookmarks.findIndex(sr => sr.fullPath === file.fullPath) > -1;
</script>

<style>

</style>

<button
  type="button"
  class="theme__add-bookmark z-10 {layout === 'grid' ? 'top-0 left-0' : 'right-0'}
  group-hover:{$theme === 'dark' ? 'text-white' : 'text-black'}"
  class:absolute
  class:text-transparent={absolute}
  style={layout === 'grid' ? '' : 'top: 30%;'}
  title="Bookmark it">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={isBookmarked(file) ? 'currentColor' : 'none'}
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-bookmark"
    class:selected={isBookmarked(file)}
    class:text-svelte-orange={isBookmarked(file)}
    on:click|stopPropagation={() => bookmarks.toggle(file)}>
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
</button>
