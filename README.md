# sort-expo-appjson

Sort Expo app.json in the same order defined at [Expo documentation](https://docs.expo.dev/versions/latest/config/app/).

## Usage

1. install it globally

```sh
npm i -g sort-expo-appjson
```

2. run it in the same directory as your app.json, that's it.

```sh
sort-expo-appjson # or seajson
```

### Options

Specify `app.json` path.

```sh
sort-expo-appjson -p src/app.json
```

Sort with specified EXPO SDK version. As default, it will use the latest version.

```sh
sort-expo-appjson -v 44.0.0
```

## Author

[@KazuyaHara](https://github.com/KazuyaHara)

## License

MIT
