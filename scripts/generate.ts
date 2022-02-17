#!/usr/bin/env node
import path from "path";

import axios from "axios";
import { cac } from "cac";
import fs from "fs-extra";
import { prompt, QuestionCollection } from "inquirer";

import { versions } from "../src/versions";

const mapKeys = (object: { [x: string]: any }, definitions: { [x: string]: any }): Array<any> =>
  Object.keys(object).map((key) => {
    const { properties, type, $ref } = object[key];
    if ($ref) {
      const definition = $ref.split("/")[2];
      return { name: key, children: mapKeys(definitions[definition].properties, definitions) };
    }
    if (type === "object") return { name: key, children: mapKeys(properties, definitions) };
    return { name: key };
  });

const fetchSchema = async () => {
  // select EXPO version
  const askVersion: QuestionCollection = [
    {
      type: "list",
      name: "version",
      message: "Select Expo SDK version",
      choices: versions.reverse(),
    },
  ];
  const { version } = await prompt(askVersion);

  // fetch schema
  const url = `http://exp.host/--/api/v2/project/configuration/schema/${version}`;
  const { schema } = await axios.get(url).then((response) => response.data.data);

  // list leys
  const { definitions, properties } = schema;
  const keys = mapKeys(properties, definitions);
  const filepath = `src/schema/${version.split(".")[0]}.json`;
  fs.ensureDirSync(path.dirname(filepath));
  await fs.writeFile(filepath, JSON.stringify(keys), "utf8");
};

const cli = cac();
cli
  .command("", "Fetch the versioned JSON schemas onf app.json from the Expo server")
  .action(fetchSchema);
cli.help();
cli.parse();
