<script>
  import { getSvgContent, getBgImgContent } from "../lib/svg-utils.js";
  import { onMount } from "svelte";

  export let file;
  export let index;
  export let size = "lg"; // 'sm', 'lg' for now

  const id = `svg-${index}`;

  let imgContent; // A promise containing the markup content of the SVG file
  let visible = false; // is the item visible in the FileBrowser viewport?

  $: {
    imgContent = getBgImgContent(file); // Watch the file for changes on disk (returns a promise); this becomes relevant when saving edited content - both the Preview and the thumbnail should update
  }

  const callback = (entries, observer) => {
    const entry = entries[0]; // there's only 1 item (this one)

    if (visible) {
      // if the item is already visible
      // don't do anything
    } else {
      if (entry.isIntersecting) {
        visible = true;
      }
    }
  };

  const options = {
    root: document.querySelector("#scrollArea"),
    rootMargin: "0px",
    threshold: 1.0
  };

  const observer = new IntersectionObserver(callback, options);

  onMount(() => {
    observer.observe(document.querySelector(`#${id}`));
  });
</script>

<div {id} class="{size === 'sm' ? 'w-6 h-6' : 'w-16 h-16'} relative">
  {#if visible}
    {#await imgContent}
      &hellip;
    {:then bgImageContent}
      <div
        class="svg-preview theme__svg-preview absolute inset-0"
        style={`background-repeat: no-repeat; background-position: center; ${bgImageContent}; background-size:contain; transform: scale(1); transition: all .5s`} />
    {/await}
  {/if}
</div>
