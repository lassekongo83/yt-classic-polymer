#!/bin/bash

# Create a new version number
bash version.sh || exit 1
# Get the new version number
new_ver=$(cat .version)
# Get the old version number
old_ver=$(sed -n 's/.*"version": "\(.*\)",/\1/p' ../src/manifest.template.json)

# Insert the new version number in the manifest
sed -i "s/\"version\": \"$old_ver\"/\"version\": \"$new_ver\"/g" ../src/manifest.template.json
sed -i "s/\"version\": \"$old_ver\"/\"version\": \"$new_ver\"/g" ../src/manifest-ff.template.json

# Remove comments from the js files
cpp -undef -P ../src/js/contentScript.js > ../extension/js/contentScript.js
cpp -undef -P ../src/js/background.js > ../extension/js/background.js
cpp -undef -P ../src/js/options.js > ../extension/js/options.js
cpp -undef -P ../src/js/popup.js > ../extension/js/popup.js
cpp -undef -P ../src/js/version.js > ../extension/js/version.js
cpp -undef -P ../src/js/localize.js > ../extension/js/localize.js

# copy the rest of the files
cp ../src/css/yt-classic.min.css ../extension/css/
cp ../src/icons/*.png ../extension/icons/
cp ../src/html/*.html ../extension/html/
cp -r ../src/_locales/* ../extension/_locales/
cp -r ../src/img/* ../extension/img/

# update version number in updates.json
cat > ../extension/updates.json <<EOF
{
  "addons": {
    "{389389aa-6501-4759-90a0-a2269a405ee0}": {
      "updates": [
        {
          "version": "${new_ver}",
          "browser_specific_settings": { "gecko": { "strict_min_version": "56" } },
          "update_link": "https://github.com/lassekongo83/yt-classic-polymer/releases/download/v${new_ver}/youtube_classic_polymer_theme-${new_ver}-an%2Bfx.xpi"
        }
      ]
    }
  }
}
EOF

# remove old version
rm -f ../extension/web-ext-artifacts/*.zip
# build chromium version
cp ../src/manifest.template.json ../extension/manifest.json
cd ../extension
web-ext build
# no point in having the ff updates.json in the chromium zip file
zip -d ../extension/web-ext-artifacts/youtube_classic_polymer_theme-${new_ver}.zip "updates.json"

# Firefox (It is handled differently with "web-ext sign --api-key=user:example --api-secret=long-number" to create the xpi file)
# Overwrite the chromium manifest with the firefox manifest (to avoid having another folder with duplicate icons, css etc.)
cp ../src/manifest-ff.template.json ../extension/manifest.json

export new_ver

read -r -p "Push to GitHub (y/n)? " git_push
if [ "$git_push" != "${git_push#[Yy]}" ]; then
  sh ../scripts/gitpush.sh
else
  echo "Done."
  exit 1
fi