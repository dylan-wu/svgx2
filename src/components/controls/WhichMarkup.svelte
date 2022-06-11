<script>
  import { useOptimized } from "../../store/svg";
</script>

<div class="theme__text flex flex-col">
  <span class="font-bold" title="Code">Code</span>

  <div class="flex space-x-4">
    <label class="flex items-center">
      <input type="radio" bind:group={$useOptimized} value={false} />
      <span class="text-xs ml-2" style="vertical-align: sub;">Original</span>
    </label>
    <label class="flex items-center">
      <input type="radio" bind:group={$useOptimized} value={true} />
      <span class="text-xs ml-2" style="vertical-align: sub;">Optimized</span>
    </label>
  </div>
</div>
