import { defaultVersion, versions } from "../versions";
import schemaList, { Schema } from "../schema";

export type ExpoObject = { expo: { [key: string]: any } };
type Version = typeof versions[number];

const selectSchema = (version: Version): Schema => {
  if (version === "40.0.0") return schemaList.v40;
  if (version === "41.0.0") return schemaList.v41;
  if (version === "42.0.0") return schemaList.v42;
  if (version === "43.0.0") return schemaList.v43;
  return schemaList.v44;
};

const sort = (object: ExpoObject["expo"], schema: Schema): ExpoObject["expo"] => {
  const order = Object.keys(object);
  const sortedKeys = order.sort((a, b) => {
    let aIndex = schema.findIndex((item) => item.name === a);
    let bIndex = schema.findIndex((item) => item.name === b);

    aIndex = aIndex >= 0 ? aIndex : Number.MAX_SAFE_INTEGER;
    bIndex = bIndex >= 0 ? bIndex : Number.MAX_SAFE_INTEGER;

    if (aIndex > bIndex) return 1;
    if (aIndex < bIndex) return -1;
    return 0;
  });

  return sortedKeys.reduce((prev, key) => {
    const schemaItem = schema.find((item) => item.name === key);
    if (!schemaItem?.children) return { ...prev, [key]: object[key] };
    return { ...prev, [key]: sort(object[key], schemaItem.children) };
  }, {});
};

export default (appJson: ExpoObject, version = defaultVersion): ExpoObject => {
  const schema = selectSchema(version);
  const sorted = sort(appJson.expo, schema);
  return { expo: sorted };
};
