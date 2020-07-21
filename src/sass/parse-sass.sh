#! /bin/bash

if [ ! "$(which sassc 2> /dev/null)" ]; then
   echo sassc needs to be installed to generate the css.
   exit 1
fi

SASSC_OPT="-M -t compact"

echo Generating the css...

sassc $SASSC_OPT main.scss ../../css/yt-classic.css

# using csso-cli to minify the css file. Can be installed with: npm install -g csso-cli
csso -i ../../css/yt-classic.css -o ../../css/yt-classic.min.css
# remove the non-minified css file
#rm ../../css/yt-classic.css
