<script>
  import { theme } from "../../store/settings";
  import { bgSize } from "../../store/svg";

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
    "vw",
    "auto"
  ];
  let x = 20;
  let y = 20;
  let xUnits = "px";
  let yUnits = "px";

  $: bgSizeValue = $bgSize;

  $: {
    if (xUnits === "auto") {
      computedXValue = `auto`;
      disableXValue = true;
    } else {
      computedXValue = `${x}${xUnits}`;
      disableXValue = false;
    }
    if (yUnits === "auto") {
      computedYValue = `auto`;
      disableYValue = true;
    } else {
      computedYValue = `${y}${yUnits}`;
      disableYValue = false;
    }

    if (computedXValue === computedYValue) {
      computedString = computedXValue;
    } else {
      computedString = `${computedXValue} ${computedYValue}`;
    }
  }

  $: {
    if (bgSizeValue === "values") {
      bgSize.set(computedString);
    } else {
      bgSize.set(bgSizeValue);
    }
  }
</script>

<label class="theme__text flex flex-col">
  <span class="font-bold" title="Background size">background-size</span>

  <select
    class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
    border-gray-400 {$theme}:border-gray-600"
    bind:value={bgSizeValue}>
    <option value="auto">auto</option>
    <option value="contain">contain</option>
    <option value="cover">cover</option>
    <option value="inherit">inherit (global)</option>
    <option value="initial">initial (global)</option>
    <option value="unset">unset (global)</option>
    <option value="values">&lt;enter values&gt;</option>
  </select>

  {#if bgSizeValue === 'values'}
    <div class="flex flex-col mt-2 mx-4 space-y-1">
      <label>
        x
        <input
          type="number"
          class="theme__tab-btn bg-gray-300 {$theme}:bg-gray-700 border
          border-gray-400 {$theme}:border-gray-600 w-12 rounded
          disabled:text-gray-600"
          bind:value={x}
          disabled={disableXValue}
          min="1" />
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
          min="1" />
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
  {/if}
</label>
