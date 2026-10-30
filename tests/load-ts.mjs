import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
const cache = new Map();
async function moduleUrl(file) {
  if (cache.has(file)) return cache.get(file);
  const source = await fs.readFile(file, "utf8");
  let output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
  const imports = [...output.matchAll(/from ["']([^"']+)["']/g)];
  for (const [full, specifier] of imports) {
    if (!specifier.startsWith(".") && !specifier.startsWith("@/")) throw new Error("Only pure local modules are supported in tests");
    const dependency = specifier.startsWith("@/") ? path.resolve("src", specifier.slice(2) + ".ts") : path.resolve(path.dirname(file), specifier + ".ts");
    output = output.replace(full, "from " + JSON.stringify(await moduleUrl(dependency)));
  }
  const url = "data:text/javascript;base64," + Buffer.from(output).toString("base64");
  cache.set(file, url);
  return url;
}
export async function loadTs(file) { return import(await moduleUrl(path.resolve(file))); }

