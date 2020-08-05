#! /bin/bash

# INKSCAPE="flatpak run org.inkscape.Inkscape"
INKSCAPE="/usr/bin/inkscape" # remove this line and uncomment the above line if you're using a flatpak install of inkscape
OPTIPNG="/usr/bin/optipng"

SRC_FILE="yt-classic-icons.svg"
INDEX="icons.txt"

for i in `cat $INDEX`
do 
if [ -f $i.png ]; then
    echo $i.png exists.
else
    echo
    echo Rendering $i.png
    $INKSCAPE --export-id=$i \
              --export-id-only \
              --export-png=$i.png $SRC_FILE >/dev/null #\
              # remove the above --export-png and uncomment the line below if you're using inkscape 1.0 or newer
              # --export-filename=$i.png $SRC_FILE >/dev/null #\
    # && $OPTIPNG -o7 --quiet $i.png
fi
done
exit 0
