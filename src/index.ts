#!/usr/bin/env node
import { cac } from "cac";

import action from "./action";
import { defaultVersion } from "./versions";

const cli = cac("sort-expo-appjson");
cli
  .command("")
  .option("-p, --path <path>", "specify app.json path", { default: "app.json" })
  .option("-v, --version <version>", "specify Expo SDK version", { default: defaultVersion })
  .action(action);
cli.help();
cli.parse();
