# TODO: real makefile
# assume pokefindercore built w/ cmake
all:
	mkdir -p build
	em++ -lembind src/lib.cpp -o build/lib.js -O3 -s WASM_BIGINT -s ENVIRONMENT=web --emit-tsd lib.d.ts -s MODULARIZE=1 --no-entry -Ilib/PokeFinder/Source/ -Lbuild/lib/PokeFinder/Source/Core -lPokeFinderCore
	perl -i -p0e  "s/(if \(typeof exports === 'object' && typeof module === 'object'\))[\s\S]*/export default Module;/g" build/lib.js
	cp build/lib.wasm ../../public/lib.wasm

clean:
	rm -rf build
	rm ../../public/lib.wasm