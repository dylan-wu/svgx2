<script>
  import { theme } from "../../store/settings";
  import { bgPosition } from "../../store/svg";
  import { backgroundPositionValue } from "../../lib/svg-utils";

  let computedXValue;
  let disableXValue = false; // disable value input for "auto" unit
  let computedYValue;
  let disableYValue = false; // disable value input for "auto" unit
  let computedString;
  let units = [
    "px",
    "%",
    "cm",
    "mm",
    "in",
    "pc",
    "pt",
    "em",
    "rem",
    "ex",
    "ch",
    "vh",
    "vw"
  ];
  let x = 20;
  let y = 20;
  let xUnits = "px";
  let yUnits = "px";
  let xEdgeOffset; // top bottom
  let yEdgeOffset; // left right

  $: bgPositionValue = $bgPosition;

  $: {
    computedString = backgroundPositionValue(
      xEdgeOffset,
      x,
      xUnits,
      yEdgeOffset,
      y,
      yUnits
    );
  }

  $: {
    if (bgPositionValue === "values") {
      bgPosition.set(computedString);
    } else {
      bgPosition.set(bgPositionValue);
    }
  }
</script>

<label class="theme__text flex flex-col space-y-2">
  <span class="font-bold" title="Background position">background-position</span>

  <select
    class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
    border-gray-400 {$theme}:border-gray-600"
    bind:value={bgPositionValue}>
    <option value="center">center</option>
    <option value="top">top</option>
    <option value="bottom">bottom</option>
    <option value="left">left</option>
    <option value="right">right</option>
    <option value="inherit">inherit (global)</option>
    <option value="initial">initial (global)</option>
    <option value="unset">unset (global)</option>
    <option value="values">&lt;enter values&gt;</option>
  </select>

  {#if bgPositionValue === 'values'}
    <!-- /* <percentage> values */ -->
    <!-- ✅background-position: 25% 75%; -->

    <!-- /* <length> values */ -->
    <!-- ✅background-position: 0 0; -->
    <!-- ✅background-position: 1cm 2cm; -->
    <!-- ✅background-position: 10ch 8em; -->

    <!-- /* Global values */ -->
    <!-- ✅background-position: inherit; -->
    <!-- ✅background-position: initial; -->
    <!-- ✅background-position: unset; -->
    <div class="flex flex-col mx-4 space-y-1">
      <label>
        x
        <input
          type="number"
          class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
          border-gray-400 {$theme}:border-gray-600 w-12 rounded
          disabled:text-gray-600"
          bind:value={x}
          disabled={disableXValue}
          min="0" />
        <select
          class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
          border-gray-400 {$theme}:border-gray-600"
          bind:value={xUnits}>
          {#each units as unit}
            <option value={unit}>{unit}</option>
          {/each}
        </select>
      </label>
      <label>
        y
        <input
          type="number"
          class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
          border-gray-400 {$theme}:border-gray-600 w-12 rounded
          disabled:text-gray-600"
          bind:value={y}
          disabled={disableYValue}
          min="0" />
        <select
          class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
          border-gray-400 {$theme}:border-gray-600"
          bind:value={yUnits}>
          {#each units as unit}
            <option value={unit}>{unit}</option>
          {/each}
        </select>
      </label>
    </div>

    <!-- Edge offsets values -->
    <!-- ✅background-position: bottom 10px right 20px; -->
    <!-- ✅background-position: right 3em bottom 10px; -->
    <!-- ✅background-position: bottom 10px right; -->
    <!-- ✅background-position: top right 10px; -->
    <!-- ✅background-position: right 20px; -->
    <!-- ✅background-position: 20px top; -->
    <div class="flex flex-col mx-4 space-y-1">
      <span>Edge offset</span>
      <label for="">
        x
        <select
          class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
          border-gray-400 {$theme}:border-gray-600 w-20"
          bind:value={xEdgeOffset}>
          <option value="">none</option>
          <option value="left">left</option>
          <option value="right">right</option>
        </select>
      </label>

      <label for="">
        y
        <select
          class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
          border-gray-400 {$theme}:border-gray-600 w-20"
          bind:value={yEdgeOffset}>
          <option value="">none</option>
          <option value="top">top</option>
          <option value="bottom">bottom</option>
        </select>
      </label>
    </div>
  {/if}
</label>
