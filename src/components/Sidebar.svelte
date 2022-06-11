<script>
  import Logo from "./Logo.svelte";
  import SidebarItem from "./SidebarItem.svelte";
  import { appName, theme } from "../store/settings";
  import { IS_DEMO } from "../lib/utils.js";
</script>

<style>

</style>

<nav class="theme__sidebar flex flex-col justify-between w-16">

  <!-- Top -->
  <div>
    <!-- Logo -->
    <div
      class="flex flex-col items-center p-4 text-svelte-orange text-center
      font-light leading-3">
      <span class="leading-7 text-2xl" title={$appName}>
        <Logo />
      </span>
      <!-- <span
        style="background-image: linear-gradient(45deg, #ff3e00 0%, #ff269e
        100%); -webkit-text-fill-color: transparent; -webkit-background-clip:
        text;">
        {$appName}
      </span> -->
      {#if IS_DEMO}
        <span class="theme__text mt-2 text-black text-xs font-bold">DEMO</span>
      {/if}
    </div>

    <!-- Menu items -->
    <div class="flex flex-col items-center">

      <!-- Files -->
      <SidebarItem label={'Browser'} title="File browser" on:setComponent>
        <path
          d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0
          0 1 2 2z" />
      </SidebarItem>

      <!-- Recents -->
      <SidebarItem label={'Recents'} title="Recent SVGs" on:setComponent>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </SidebarItem>

      <!-- Bookmarks -->
      <SidebarItem label={'Bookmarks'} title="Bookmarked SVGs" on:setComponent>
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </SidebarItem>
    </div>
  </div>

  <!-- Bottom -->
  <div>
    <!-- Theme controls -->
    <div class="flex flex-col items-center">

      <!-- Settings -->
      <SidebarItem label={'Settings'} title="Settings" on:setComponent>
        <circle cx="12" cy="12" r="3" />
        <path
          d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0
          1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2
          2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0
          0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65
          0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1
          2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0
          0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65
          0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51
          1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0
          2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2
          0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </SidebarItem>

      <!-- Help -->
      <SidebarItem
        label={'Help'}
        title="Help & keyboard shortcuts"
        on:setComponent>
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12" y2="17" />
      </SidebarItem>

      <button
        type="button"
        title="Toggle light/dark mode"
        class="flex flex-col items-center w-full mb-4 mt-8 border-l-4 text-xs
        leading-3 uppercase group"
        on:click={$theme === 'dark' ? theme.set('light') : theme.set('dark')}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="16"
          height="16"
          fill="currentColor"
          class="mb-1">
          <path
            d="M10 2v16a8 8 0 1 0 0-16zm0 18a10 10 0 1 1 0-20 10 10 0 0 1 0 20z" />
        </svg>
        <span
          class="theme__svg-txt {$theme === 'dark' ? 'text-gray-800 group-hover:text-gray-200' : 'text-gray-200 group-hover:text-black'}">
          {$theme === 'dark' ? 'light' : 'dark'} mode
        </span>
      </button>
    </div>

    <!-- Version -->
    <!-- <div
      class="text-gray-600 font-mono text-center p-4 pt-0"
      style="font-size: 10px;">
      v{process.env.npm_package_version}
    </div> -->
  </div>
</nav>
