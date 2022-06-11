<script>
  import Files from "./Files.svelte";
  import Help from "./Help.svelte";
  import Settings from "./Settings.svelte";
  import Notifier from "./components/Notifier.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import { isFiles } from "./lib/utils";
  import { theme, activeMenu } from "./store/settings";
  import { onMount } from "svelte";

  const pages = [
    { id: "Help", component: Help },
    { id: "Settings", component: Settings }
  ];

  let component = "Browser";

  function setComponent(event) {
    const { menu, visible } = { ...$activeMenu };
    component = event.detail.component;
    let activeMenuProps = { menu: component };

    // if I'm locating the file, I want to just open the File Browser, not toggle it
    const from = event.detail.from;
    if (from && from === "locate") {
      activeMenuProps.visible = true;
    } else {
      activeMenuProps.visible = isFiles(component) // clicking the "Files" menu items toggles it, otherwise it shows the clicked menu
        ? component === menu
          ? !visible
          : true
        : true;
    }

    activeMenu.set(activeMenuProps);
  }
</script>

<style>

</style>

<main class="{`theme--${$theme}`} relative w-full h-screen overflow-hidden">

  <div class="flex flex-row h-full">
    <Sidebar on:setComponent={event => setComponent(event)} />

    <section class="flex-1 m-2 ml-0">
      {#if isFiles($activeMenu.menu)}
        <Files on:setComponent={event => setComponent(event)} />
      {:else}
        <!-- Dynamic content -->
        <svelte:component
          this={pages.find(c => c.id === $activeMenu.menu).component} />
      {/if}
    </section>
  </div>

  <!-- SnackBar notifications -->
  <Notifier />

</main>

<svelte:head>
  <script src="../node_modules/focus-visible/dist/focus-visible.min.js">

  </script>
  <link
    rel="stylesheet"
    href="../node_modules/huebee/huebee.css"
    media="screen" />
</svelte:head>
