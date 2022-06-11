<script>
  import FileBrowser from "./components/browser/FileBrowser.svelte";
  import PreviewPane from "./components/PreviewPane.svelte";
  import { currentFolder, activeMenu } from "./store/settings";

  const handleNavigateTo = event => {
    currentFolder.set(event.detail.path);
    activeMenu.set({
      visible: true,
      menu: "Browser"
    });
  };
</script>

<style>

</style>

<div class="flex h-full">
  <FileBrowser on:navigateTo={handleNavigateTo} />

  <PreviewPane on:navigateTo={handleNavigateTo} on:setComponent />
</div>
