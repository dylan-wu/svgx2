<script>
  import { theme } from "../../store/settings";
  import { bgRepeat } from "../../store/svg";
</script>

<label class="theme__text flex flex-col">
  <span class="font-bold" title="Background repeat">background-repeat</span>

  <select
    class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
    border-gray-400 {$theme}:border-gray-600"
    bind:value={$bgRepeat}>
    <option value="no-repeat">no-repeat</option>
    <option value="repeat-x">repeat-x</option>
    <option value="repeat-y">repeat-y</option>
    <option value="repeat">repeat</option>
    <option value="space">space</option>
    <option value="round">round</option>
  </select>
</label>
