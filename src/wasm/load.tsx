import { useState } from "react";
import MainModuleFactory, { MainModule } from "./build/lib";

let WasmLib: MainModule | null = null;

export default function wasmLibrary(): MainModule | null {
  const [lib, setLib] = useState<MainModule | null>(null);
  if (!WasmLib) {
    MainModuleFactory().then((module) => {
      WasmLib = module;
    });
  }
  if (WasmLib !== lib) {
    setLib(WasmLib);
  }
  return lib;
}
