
const self = globalThis;

import MainModuleFactory from "../wasm/build/lib.js";

let WasmLib = null;

// TODO: more sensible communication
self.onmessage = (e) => {
  if (e.data === "Load") {
    MainModuleFactory({
      // workers do some path shenanigans
      // this is a hack to fix that
      locateFile: (path) => {
        return import.meta.env.BASE_URL + path;
      }
    }).then((module) => {
      WasmLib = module;
      self.postMessage("Loaded");
    });
  } else {
    const progressCallback = (progress) => {
      self.postMessage(progress);
    };
    const resultCallback = (result) => {
      self.postMessage(result);
    };
    WasmLib.find_sid_results(...e.data, progressCallback, resultCallback);
  }
};