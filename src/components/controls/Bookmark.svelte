<script>
  import { bookmarks } from "../../store/app";
  import { selectedFile } from "../../store/settings";
  import { createEventDispatcher } from "svelte";
  import BookmarkToggler from "../BookmarkToggler.svelte";

  const dispatch = createEventDispatcher();
</script>

<div class="theme__control-wrapper flex flex-col items-center p-2">
  <BookmarkToggler file={$selectedFile} size="24" absolute={false} />
</div>
