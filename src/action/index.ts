import consola from "consola";
import { lstat, readFile, writeFile } from "fs/promises";
import { resolve } from "path";
import prettier from "prettier";

import sort from "../sort";
import { versions } from "../versions";

type Options = { "--": any[]; p: string; path: string; v: string; version: string };

export default async ({ path, version }: Options) => {
  try {
    // check version
    const include = versions.includes(version);
    if (!include) throw new Error(`${version} is not supported. Supported: ${versions.join(", ")}`);

    // check app.json exists
    const appJsonPath = resolve(process.cwd(), path);
    const foundAppJson = await lstat(appJsonPath).then((stats) => stats.isFile());
    if (!foundAppJson) throw new Error(`Could not find ${path}`);

    // read app.json
    const appJson = JSON.parse(await readFile(appJsonPath, "utf-8"));

    // sort app.json
    const sorted = sort(appJson, version);

    // format app.json
    const prettierConfig = await prettier.resolveConfigFile();
    const prettierOptions = prettierConfig ? prettier.resolveConfig(prettierConfig) : {};
    const formatted = prettier.format(JSON.stringify(sorted), {
      parser: "json-stringify",
      ...prettierOptions,
    });

    // write app.json
    await writeFile(appJsonPath, formatted, "utf-8");
    consola.success(`${path} sorted!`);
  } catch (error: any) {
    consola.error(error?.message || "Something went wrong");
  }
};
