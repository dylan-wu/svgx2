<script>
  import { contact } from "./store/settings.js";
  import KeyboardShortcuts from "./KeyboardShortcuts.svelte";

  const { shell } = require("electron");

  const icon = {
    www: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-globe"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
    twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`,
    github: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>`
  };

  function openUrl(url) {
    shell.openExternal(url);
  }
</script>

<style>

</style>

<div class="theme__text h-full flex overflow-auto">
  <div class="w-full space-y-2">
    <h2 class="font-thin text-3xl">Help</h2>

    <div
      class="theme__bg w-full flex flex-col items-end max-w-2xl mx-auto mb-4 p-4
      space-y-4 rounded shadow">

      <div class="w-full flex flex-row items-center space-x-4">
        <div class="w-1/3 flex flex-col self-start text-right">
          <label class="text-xl font-thin">Contact</label>
          <em class="text-xs text-gray-600">
            <!-- ... -->
          </em>
        </div>
        <div class="flex-1 grid grid-cols-2 gap-4">
          <div class="flex space-x-2">
            {@html icon.www}
            <div class="w-full flex">
              <a
                href={contact.www}
                class="text-svelte-orange underline"
                on:click|preventDefault={() => openUrl(contact.www)}>
                {contact.www.replace(/https:\/\//, '')}
              </a>
            </div>
          </div>
          <div class="flex space-x-2">
            {@html icon.mail}
            <div class="w-full flex">{contact.email}</div>
          </div>
          <div class="flex space-x-2">
            {@html icon.twitter}
            <div class="w-full flex">
              <a
                href={`https://twitter.com/${contact.appTwitter}`}
                class="text-svelte-orange underline"
                on:click|preventDefault={() => openUrl(`https://twitter.com/${contact.appTwitter}`)}>
                @{contact.appTwitter}
              </a>
            </div>
          </div>
          <div class="flex space-x-2">
            {@html icon.twitter}
            <div class="w-full flex items-baseline">
              <a
                href={`https://twitter.com/${contact.authorTwitter}`}
                class="text-svelte-orange underline"
                on:click|preventDefault={() => openUrl(`https://twitter.com/${contact.authorTwitter}`)}>
                @{contact.authorTwitter}
              </a>
              <span class="text-xs ml-2">/author</span>
            </div>
          </div>
        </div>
      </div>

      <hr class="theme__border w-full border-b border-t-0" />

      <div class="w-full flex flex-row items-center space-x-4">
        <div class="w-1/3 flex flex-col self-start text-right">
          <label class="text-xl font-thin">Source Code</label>
          <em class="text-xs text-gray-600">
            <!-- ... -->
          </em>
        </div>
        <div class="flex-1 space-y-4">
          <div>
            SVGX is made with
            <strong>Electron</strong>
            ,
            <strong>Svelte</strong>
            , and
            <strong>TailwindCSS</strong>
            .
            <br />
            Want to really know what makes it tick? You can purchase access to
            the full source code on GitHub for an affordable price.
          </div>
          <div class="flex space-x-2">
            {@html icon.github}
            <div class="w-full flex">
              <a
                href={contact.gumroadLink}
                class="text-svelte-orange underline"
                on:click|preventDefault={() => openUrl(contact.gumroadLink)}>
                {contact.gumroadLink}
              </a>
            </div>
          </div>
        </div>
      </div>

      <hr class="theme__border w-full border-b border-t-0" />

      <KeyboardShortcuts />

    </div>

  </div>
</div>
