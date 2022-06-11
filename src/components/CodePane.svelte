<script>
  const ipcRenderer = require("electron").ipcRenderer;
  import { onMount, createEventDispatcher, tick } from "svelte";
  import { activeTab } from "../store/app";
  import { theme, selectedFile } from "../store/settings";
  import {
    svgContent,
    originalSvgContent,
    originalFileModified,
    optimizedSvgContent,
    bgRepeat,
    bgPosition,
    bgSize,
    useOptimized
  } from "../store/svg";
  import { encodeSvg } from "../lib/svg-utils.js";
  import ExportWidget from "./controls/ExportWidget.svelte";
  import ExternalQuotes from "./controls/ExternalQuotes.svelte";
  import WhichMarkup from "./controls/WhichMarkup.svelte";
  import hljs from "highlight.js/lib/highlight";
  hljs.initHighlighting.called = false;
  hljs.initHighlighting();
  hljs.registerLanguage("html", require("highlight.js/lib/languages/xml"));

  const dispatch = createEventDispatcher();
  const { clipboard } = require("electron");

  let highlightedSvgContent;
  let highlightedOptimizedSvgContent;
  let urlEncodedSvgContent;
  let bgImageContent;
  let externalQuotes = "double"; // double, single
  let clipboardContent = "";
  let rawMarkup; // the DOM element containing the raw SVG markup (used when editing)
  let editingMarkup = false; // toggles editing mode in the Code pane

  $: {
    ipcRenderer.send("originalFileModified", {
      originalFileModified: $originalFileModified
    });
  }

  $: quotes = externalQuotes === "double" ? `"` : `'`;

  $: {
    // Display content
    urlEncodedSvgContent = encodeSvg(
      $useOptimized ? $optimizedSvgContent : $svgContent,
      externalQuotes
    );
    bgImageContent = `background-repeat: ${$bgRepeat}; background-position: ${$bgPosition}; background-size: ${$bgSize}; background-image: url(${quotes}data:image/svg+xml,${urlEncodedSvgContent}${quotes});`;

    if ($svgContent) {
      // Highlight the code
      highlightedSvgContent = hljs.highlight("html", $svgContent).value;
      if ($optimizedSvgContent) {
        highlightedOptimizedSvgContent = hljs.highlight(
          "html",
          $optimizedSvgContent
        ).value;
      }
    } else {
      // This allows empty SVG content to be rendered
      highlightedSvgContent = "";
      highlightedOptimizedSvgContent = "";
      urlEncodedSvgContent = "";
      bgImageContent = "";
    }

    // Clipboard content
    switch ($activeTab) {
      case "svgo":
        clipboardContent = $optimizedSvgContent;
        break;
      case "urlencoded":
        clipboardContent = urlEncodedSvgContent;
        break;
      case "bgimg":
        clipboardContent = bgImageContent;
        break;
      default:
        // "code"
        clipboardContent = $svgContent;
        break;
    }
  }

  const switchTab = tab => {
    activeTab.set(tab);
    if ($activeTab === "bgimg") {
      dispatch("openCustomizePane");
    } else {
      dispatch("closeCustomizePane");
    }
  };

  function customizePanelAction() {
    return {
      // Close the Customize Panel when I move away from the background-image tab
      // Elegant way to handle resetting the panel when selecting another file
      destroy() {
        dispatch("closeCustomizePane");
      }
    };
  }

  const copyInnerSvgToClipboard = () => {
    const el = document.createElement("div");

    switch ($activeTab) {
      case "code":
        el.innerHTML = $svgContent;
        break;
      case "svgo":
        el.innerHTML = $optimizedSvgContent;
        break;
      default:
        el.remove();
    }

    if (el && el.innerHTML) {
      clipboard.writeText(el.querySelector("svg").innerHTML);

      // Send this event to the Main process, which will then forward it to the Notifier component
      ipcRenderer.send("innerMarkupCopied");

      el.remove();
    }
  };

  const copyToClipboard = text => {
    clipboard.writeText(text);

    // Send this event to the Main process, which will then forward it to the Notifier component
    ipcRenderer.send("markupCopied");
  };

  async function editMarkup() {
    editingMarkup = true;
    await tick(); // Give time for the textarea to render
    const rawMarkupEl = document.querySelector("#rawMarkup");

    // Allow edit + focus only in the Code pane
    if (!rawMarkupEl) {
      editingMarkup = false;
      return;
    }

    rawMarkupEl.focus();
  }

  // As I type in the code pane, refresh the rendered SVG in Preview
  function refreshPreview() {
    // Compare the state of the file when it was originally opened, to the modified state
    originalFileModified.set(rawMarkup.value !== $originalSvgContent);

    // Update the SVG content as I type
    svgContent.set(rawMarkup.value);
  }

  // Emit event to Main process to save the SVG content
  function saveSvg() {
    // Save the file only if the contents have changed
    if ($originalFileModified) {
      ipcRenderer.send("saveSvg", {
        selectedFile: $selectedFile,
        fileContent: $svgContent
      });
    }
  }

  onMount(() => {
    ipcRenderer
      // Handle typing Esc
      .on("escape", (event, args) => {
        editingMarkup = false;
      })

      // Read the opened file contents & assign it to the message
      .on("saveFile", (event, args) => {
        saveSvg();
      })

      // Reset the modified state once the file has been saved
      .on("fileSaved", (event, args) => {
        originalFileModified.set(false); // Remove the "file modified" dot
        originalSvgContent.set($svgContent); // Original content becomes the newly saved file content
        editingMarkup = false; // Exit editing mode
      })

      // Discard the changes made to the markup
      .on("revertChanges", (event, args) => {
        svgContent.set($originalSvgContent); // Restore the content in Code & Preview from the saved original code
        originalFileModified.set(false);
        editingMarkup = false;
      });
  });

  function registerEvents(event) {
    // don't trigger the hotkeys when typing in the search box, or while editing the raw SVG markup
    if (event.target.id === "search" || event.target.id === "rawMarkup") return;

    switch (event.code) {
      case "KeyC":
        if (event.altKey) {
          copyInnerSvgToClipboard();
        } else {
          copyToClipboard(clipboardContent);
        }
        break;
    }
  }
</script>

<style>

</style>

<svelte:window on:keyup={registerEvents} />
<div
  class="theme__code-bg flex flex-col w-full pb-1 shadow rounded"
  style="min-height: 30vh; max-height: 30vh;">

  <div class="flex items-center justify-between mb-2">

    <!-- Tabs -->
    <div class="flex items-center">
      <div class="flex rounded-br">
        <button
          class="{$activeTab === 'code' ? 'bg-svelte-orange text-white' : 'theme__text'}
          theme__tab-btn text-xs px-2 py-1 rounded-tl"
          on:click={() => switchTab('code')}>
          Code
        </button>
        <button
          class="{$activeTab === 'svgo' ? 'bg-svelte-orange text-white' : 'theme__text'}
          theme__tab-btn text-xs px-2 py-1"
          on:click={() => switchTab('svgo')}>
          Optimized
        </button>
        <button
          class="{$activeTab === 'urlencoded' ? 'bg-svelte-orange text-white' : 'theme__text'}
          theme__tab-btn text-xs px-2 py-1"
          on:click={() => switchTab('urlencoded')}>
          URL encoded
        </button>
        <button
          class="{$activeTab === 'bgimg' ? 'bg-svelte-orange text-white' : 'theme__text'}
          theme__tab-btn text-xs px-2 py-1 rounded-br"
          on:click={() => switchTab('bgimg')}>
          background-image
        </button>
      </div>
    </div>

    <!-- Copy controls -->
    <div class="flex text-right pt-1 pr-1">
      {#if $activeTab === 'code' || $activeTab === 'svgo'}
        <ExportWidget />

        <button
          type="button"
          class="btn--xs leading-tight py-1 mr-1"
          title="Alt+C - Copy inner SVG to clipboard"
          on:click={() => copyInnerSvgToClipboard()}>
          Copy inner
        </button>
      {/if}

      <button
        type="button"
        class="btn--xs leading-tight py-1"
        title="C - Copy to clipboard"
        on:click={copyToClipboard(clipboardContent)}>
        Copy
      </button>
    </div>
  </div>

  <!-- Wrapper -->
  <div class="flex overflow-auto h-full">
    <!-- Code -->
    <div
      class="theme__text h-full {$activeTab === 'code' || $activeTab === 'svgo' ? 'w-full' : 'w-3/4'}
      text-xs font-mono"
      class:p-2={!editingMarkup}
      class:px-1={editingMarkup}
      style="word-break: break-all; white-space: pre-wrap; word-wrap:
      break-word;"
      on:click={() => editMarkup()}>

      {#if $activeTab === 'svgo'}
        <code class="theme__text">
          {#await $optimizedSvgContent}
            optimizing...
          {:then oSvgC}
            {@html highlightedOptimizedSvgContent}
          {/await}
        </code>
      {:else if $activeTab === 'urlencoded'}
        <code class="theme__text">
          {@html urlEncodedSvgContent}
        </code>
      {:else if $activeTab === 'bgimg'}
        <code class="theme__text" use:customizePanelAction>
          {@html bgImageContent}
        </code>
      {:else if editingMarkup}
        <textarea
          name=""
          id="rawMarkup"
          spellcheck="false"
          class="theme__text theme__bg w-full box-border h-full p-1"
          bind:this={rawMarkup}
          bind:value={$svgContent}
          on:keyup={() => refreshPreview()}
          on:blur={() => (editingMarkup = false)} />
      {:else}
        <code class="language-html">
          {@html highlightedSvgContent}
        </code>
      {/if}
    </div>

    {#if $activeTab !== 'code' && $activeTab !== 'svgo'}
      <div
        class="theme__tab-btn bg-gray-200 {$theme}:bg-gray-800 w-1/4 space-y-2
        mt-2 mr-1 p-2 rounded shadow-inner text-xs overflow-auto">

        <!-- Use original or optimized code? -->
        <WhichMarkup />

        <!-- External quotes -->
        <ExternalQuotes
          {externalQuotes}
          on:setExternalQuotes={event => (externalQuotes = event.detail.externalQuotes)} />

      </div>
    {/if}
  </div>
  <!-- /Wrapper -->

</div>
