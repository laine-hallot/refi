promethee-gen-compile-commands:
    #!/usr/bin/env bash
    cd packages/runtime/external/promethee
    bear -- make

promethee-init:
    #!/usr/bin/env bash
    cd packages/runtime/external/promethee && ./get-deps;
    cd duktape && make configure-deps

promethee-run:
    cd packages/runtime/external/promethee && make run

refi-init:
    npm i

refi-build-example:
    #!/usr/bin/env bash
    npm -w packages/example run build

refi-type-check:
    npx tsc -b

refi-build-js:
    just refi-type-check
    just refi-build-example

init:
    just promethee-init
    just refi-init

dev: refi-build-example
    cp packages/example/dist/script.js packages/runtime/external/promethee/
    just promethee-run
