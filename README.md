# refi
A react platform for UEFI

## Usage
I don't have any packages for refi published so for now just clone this repo and replace `packages/example` with your project. There is a nix flake that provides a dev shell which will take care of system dependencies.
1. Clone repo
1. `nix develop`
1. `just init`
    - Optionally `just promethee-gen-compile-commands` if you plan on working on the C runtime and want a nicer time editing those files.
1. `just dev`
