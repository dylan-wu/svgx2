# SVGX - SVG icon manager

[SVGX](https://svgx.app/) is a desktop (Mac/Windows/Linux - soon) SVG icon/asset manager. It works with SVG files and libraries that you store offline, and does not require an internet connection.

This project is based on the [Electron Forge Svelte boilerplate](https://github.com/breadthe/electron-forge-svelte.git).

## Usage

```bash
git clone https://github.com/breadthe/svgx.git
cd svgx

# Install dependencies
yarn install # npm install

# Run in dev mode
yarn start # Mac/Linux
yarn start-win # Windows

# Build production bundle (native executable) - outputs to a folder named out/
yarn make

# Run tests
yarn test
```

![SVGX - SVG icon manager](https://user-images.githubusercontent.com/17433578/96373475-59f1fc00-1132-11eb-8006-a4c4a3cff0fc.png)

## Requirements

The SVGX build is officially compatible with:

- Windows 10
- Mac OS X Yosemite 10.10+

## App icons

Follow these instructions to generate application icons for each platform (Mac/Windows/Linux).

First, install the [electron-icon-maker](https://github.com/jaretburkett/electron-icon-maker) utility globally.

Next, in your project folder, run the `electron-icon-maker` command to create the icon sets:

```bash
electron-icon-maker --input=svgx-logo-v3-1024.png --output=./appicons
```

Finally, run the `make` command like so:

**Mac**

```bash
yarn make --platform=darwin --icon=src/icons/mac/icon.icns
```

**Win**

```bash
yarn make --platform=win32 --icon=src/icons/win/icon.ico
```

**Linux**

```bash
yarn make --platform=linux --icon=src/icons/png/1024x1024.ico
```

# License

The SVGX source code is a paid product. If you've purchased access to this repo, here are some of the legal permissions and limitations for using this repo:

✅ You may:

- clone or download it
- use any parts of the code to build other products/software (including paid products)
- compile and distribute the app under a different name than **SVGX**

❌ You may not:

- sell the compiled app
- sell (or give others) access to this repo
- use the **SVGX** name or brand on other apps fully or partially derived from this source code
