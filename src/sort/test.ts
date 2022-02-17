import sort, { ExpoObject } from ".";

const appJsonObject: ExpoObject = {
  expo: {
    name: "sort-expo-appjson",
    slug: "sort-expo-appjson",
    ios: { config: { googleMapsApiKey: "xxx", usesNonExemptEncryption: false }, buildNumber: "1" },
    splash: { backgroundColor: "#ffffff", image: "./assets/splash.png", resizeMode: "cover" },
    version: "0.0.0",
  },
};

describe("sort", () => {
  const sorted = sort(appJsonObject);

  test("top level keys", () => {
    expect(Object.keys(sorted.expo)).toEqual(["name", "slug", "version", "splash", "ios"]);
  });

  test("nested keys", () => {
    expect(Object.keys(sorted.expo.splash)).toEqual(["backgroundColor", "resizeMode", "image"]);
  });

  test("deep nested keys", () => {
    expect(Object.keys(sorted.expo.ios.config)).toEqual([
      "usesNonExemptEncryption",
      "googleMapsApiKey",
    ]);
  });
});
