{
  description = "Dev shell for Promethee — UEFI bindings for JavaScript";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system;
          config = {
            permittedInsecurePackages = [
              "python-2.7.18.12"
            ];
          };
        };
      in {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            # Build toolchain
            gcc
            gnumake
            binutils
            nasm

            nodejs_24


            python27Full
            python315
            python315Packages.pyyaml

            # get-deps fetcher
            git
            curl

            # QEMU for `make run`
            qemu
          ];

          shellHook = ''
            echo "promethee dev shell"
            echo "  next:  ./get-deps && make run"
          '';
        };
      });
}
