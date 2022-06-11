<script>

</script>

<style>

</style>

<div class="w-full flex flex-row items-center space-x-4">
  <!-- Left column -->
  <div class="w-1/3 flex flex-col self-start text-right">
    <label class="text-xl font-thin">Keyboard shortcuts</label>
    <em class="text-xs text-gray-600">
      <!-- ... -->
    </em>
  </div>

  <!-- Right column -->
  <div class="w-2/3 space-y-8">

    <!-- Search shorcuts -->
    <div class="space-y-4">
      <div class="theme__tab-btn px-4 py-2 rounded">Search shorcuts</div>

      <div class="flex items-start">
        <div class="w-1/4 flex items-center">
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            /
          </div>
        </div>
        <div class="ml-4">Focus the search box</div>
      </div>

      <div class="flex items-start">
        <div class="w-1/4 flex items-center">
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            Esc
          </div>
        </div>
        <div class="ml-4">
          <div>Clear the search box</div>
          <div>Exit editing mode</div>
        </div>
      </div>
    </div>

    <!-- File operations shorcuts -->
    <div class="space-y-4">
      <div class="theme__tab-btn px-4 py-2 rounded">
        File operations shorcuts
      </div>

      <div class="flex items-start">
        <div class="w-1/4 flex items-center space-x-2">
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            {process.platform === 'win32' ? 'Ctrl' : 'Cmd'}
          </div>
          <span>+</span>
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            o
          </div>
        </div>
        <div class="ml-4">Open an SVG file from your computer</div>
      </div>

      <div class="flex items-start">
        <div class="w-1/4 flex items-center space-x-2">
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            {process.platform === 'win32' ? 'Ctrl' : 'Cmd'}
          </div>
          <span>+</span>
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            s
          </div>
        </div>
        <div class="ml-4">Save the current SVG, if modified</div>
      </div>
    </div>

    <!-- Code shorcuts -->
    <div class="space-y-4">
      <div class="theme__tab-btn px-4 py-2 rounded">Code shorcuts</div>

      <div class="flex items-start">
        <div class="w-1/4 flex items-center">
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            c
          </div>
        </div>
        <div class="ml-4">Copy the SVG code</div>
      </div>

      <div class="flex items-start">
        <div class="w-1/4 flex items-center space-x-2">
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            {process.platform === 'win32' ? 'Alt' : 'Opt'}
          </div>
          <span>+</span>
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            c
          </div>
        </div>
        <div class="ml-4">Copy the inner SVG code</div>
      </div>
    </div>

    <!-- Zoom controls -->
    <div class="space-y-4">
      <div class="theme__tab-btn px-4 py-2 rounded">Zoom controls</div>

      <div class="flex items-start">
        <div class="w-1/4 flex items-center">
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            ]
          </div>
        </div>
        <div class="ml-4">
          <div>Zoom in</div>
        </div>
      </div>

      <div class="flex items-start">
        <div class="w-1/4 flex items-center">
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            [
          </div>
        </div>
        <div class="ml-4">
          <div>Zoom in</div>
        </div>
      </div>

      <div class="flex items-start">
        <div class="w-1/4 flex items-center">
          <div
            class="theme__bg border-2 border-gray-700 rounded-lg px-2 py-0
            inline font-mono font-black uppercase text-center"
            style="box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 0.3);">
            \
          </div>
        </div>
        <div class="ml-4">
          <div>Reset zoom</div>
        </div>
      </div>
    </div>

  </div>
  <!-- /Right column -->

</div>
