#! /bin/bash

if [ ! "$(which sassc 2> /dev/null)" ]; then
   echo sassc needs to be installed to generate the css.
   exit 1
fi

SASSC_OPT="-M -t compact"

echo Generating the css...

sassc $SASSC_OPT main.scss ../inject/inject.css

# using csso-cli to minify the css file. Can be installed with: npm install -g csso-cli
csso -i ../inject/inject.css -o ../inject/inject.min.css
# remove the non-minified css file
rm ../inject/inject.css
