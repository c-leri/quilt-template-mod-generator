# Quilt Template Mod Generator

A tool to generate your own Quilt Templates !

# Usage

## Online

Head to [https://c-leri.github.io/quilt-template-mod-generator/](https://c-leri.github.io/quilt-template-mod-generator/) fill the form and click `Generate Template`!

## Run Locally

Clone the project and run `pnpm install` to install dependencies then `pnpm dev` to start a development server

# Adding Translations

- Copy the `en` folder in /src/lib/translations and name the new folder with the code of the language you are adding (see [https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes))
- Provide a translation for each key in each of the `*.json` files in the new folder
- Add an entry for the added language in /src/lib/translations/lang.json
- Add the newly added language to the `translations` field of the config in /src/lib/translations/index.ts
