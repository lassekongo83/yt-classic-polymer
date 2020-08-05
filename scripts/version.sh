#!/bin/bash

version=$(cat .version)
semver=(${version//./ })
ma="${semver[0]}"
mi="${semver[1]}"
p="${semver[2]}"

read -r -p "Enter a number: (1. Major | 2. Minor | 3. Patch) "  ver_type

if [[ $ver_type != "1" ]] && [[ $ver_type != "2" ]] && [[ $ver_type != "3" ]]; then
  echo "Invalid input"
  exit 1
elif [[ $ver_type == "3" ]]; then
  echo "Patch"
  ((p++))
elif [[ $ver_type == "2" ]]; then
  echo "Minor"
  ((mi++))
  # reset p to 0
  p=0
elif [[ $ver_type == "1" ]]; then
  echo "Major"
  ((ma++))
  p=0
  mi=0
fi

echo "The new version number is: ${ma}.${mi}.${p}"
read -r -p "Is this the correct version number? (y/n) " yesno
if [ "$yesno" != "${yesno#[Yy]}" ]; then
  echo "${ma}.${mi}.${p}" > .version
else
  echo "Script canceled by user."
  exit 1
fi