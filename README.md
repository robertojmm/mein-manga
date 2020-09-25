<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Description

Mein-Manga is an individual and comfortable comic/manga reader

## Installation

You can manually download the lates version of the server from [here](https://github.com/robertojmm/mein-manga/archive/master.zip)

```bash
# Downloading the app
$ git clone --recurse-submodules git@github.com:robertojmm/mein-manga.git

# Installing dependencies
$ npm run install:all

# Build WebApp
$ cd web && npm run build

# Build Server
$ cd .. && npm run build:windows (or linux)
```
:exclamation:
:exclamation:
 Don't forget to edit `src/env.ts` with your credentials
:exclamation:
:exclamation:

:exclamation:
:exclamation:
 Don't forget to change folder paths in `dist/settings.json` once you executed the app
:exclamation:
:exclamation:

## Running the app

```bash
# Basic run
$ npm start


# Using screen
# Create the screen
$ screen -S mein-manga

# Then execute the app
$ npm start

# To exit without stopping the app
Control + A, then Control + D
```


## License

Mein-Manga and Nest are [MIT licensed](LICENSE).
