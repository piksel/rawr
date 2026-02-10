#!/usr/bin/env bash

set -e

echo Generating HexBox chars...
node generate.mjs

echo Building OTF...
fontforge -lang=ff -c 'Open($1); Generate($2)' rawr.sfdir rawr.otf

echo Building WOFF2...
fontforge -lang=ff -c 'Open("rawr.sfdir"); Generate("rawr.woff2")'
# rawr.sfdir rawr.woff2