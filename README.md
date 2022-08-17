# Build Tool for vshaxe

[![CI](https://img.shields.io/github/workflow/status/vshaxe/vshaxe-build/CI.svg?logo=github)](https://github.com/vshaxe/vshaxe-build/actions?query=workflow%3ACI)

This is a CLI and VSCode extension build tool for Haxe projects.

## Installing

The VSCode extension cannot currently be installed via the VSCode extension marketplace, so it must be [built from source](#building).

You can install the CLI tool using your preferred Haxe package manager:

Via [haxelib](https://github.com/HaxeFoundation/haxelib/):

```sh
haxelib git vshaxe-build https://github.com/vshaxe/vshaxe-build
# You can now run
haxelib run vshaxe-build
```

Via [lix](https://github.com/lix-pm/lix.client):

```sh
lix install github:vshaxe/vshaxe-build
# You can now run
lix run vshaxe-build
```

## Building

Dependencies can be installed by running:

```sh
npm install
```

To package and install the VSCode extension, you must have [VSCode](https://code.visualstudio.com) and [vsce](https://github.com/microsoft/vscode-vsce#usage) installed and available in PATH.

It is then possible to package and install the extension using:

```sh
vsce package
code --install-extension vshaxe-build-*.vsix
```

If you want to work on `vshaxe-build`, you can build the various components via:

```sh
# build all components
npx lix run vshaxe-build -t all
# build the cli script
npx lix run vshaxe-build -t run-script
# build the vscode extension
npx lix run vshaxe-build -t extension
# build the json schema
npx lix run vshaxe-build -t schema
```
