{
  description = "Description for the project";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = inputs@{ flake-parts, nixpkgs, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      imports = [
        # To import a flake module
        # 1. Add foo to inputs
        # 2. Add foo as a parameter to the outputs function
        # 3. Add here: foo.flakeModule

      ];
      systems =
        [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" "x86_64-darwin" ];
      perSystem = { config, self', inputs', pkgs, system, ... }:
        let
          ndkVersion = "26.1.10909125";
          buildToolsVersion = "35.0.0";
          androidComposition = pkgs.androidenv.composeAndroidPackages {
            includeEmulator = true;
            includeNDK = true;
            platformVersions = [ "35" ];
            ndkVersions = [ ndkVersion ];
            buildToolsVersions = [ buildToolsVersion "34.0.0" ];
            includeSystemImages = true;
            cmakeVersions = [ "3.22.1" ];
          };
          androidSdk = androidComposition.androidsdk;
        in {
          _module.args.pkgs = import nixpkgs {
            inherit system;
            config = {
              allowUnfree = true;
              android_sdk.accept_license = true;
            };
          };

          devShells.default = pkgs.mkShell rec {
            ANDROID_HOME = "${androidSdk}/libexec/android-sdk";
            ANDROID_SDK_ROOT = "${ANDROID_HOME}";
            ANDROID_NDK_ROOT = "${ANDROID_SDK_ROOT}/ndk-bundle";
            GRADLE_OPTS =
              "-Dorg.gradle.project.android.aapt2FromMavenOverride=${ANDROID_SDK_ROOT}/build-tools/${buildToolsVersion}/aapt2";
            JAVA_HOME = "${pkgs.jdk}";

            buildInputs = with pkgs; [
              pnpm
              nodejs
              nodePackages.prettier
              androidComposition.platform-tools
              androidSdk
              jdk
              pkg-config
            ];
            shellHook = ''
              export PNPM_HOME="$HOME/.local/share/pnpm"
              export PATH="$PNPM_HOME:$PATH"
              export ANDROID_AVD_HOME="$XDG_CONFIG_HOME/.android/avd";
            '';
          };

          # Equivalent to  inputs'.nixpkgs.legacyPackages.hello;
          packages.default = pkgs.hello;
        };
      flake = {
        # The usual flake attributes can be defined here, including system-
        # agnostic ones like nixosModule and system-enumerating ones, although
        # those are more easily expressed in perSystem.

      };
    };
}
