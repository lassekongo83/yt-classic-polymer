#!/bin/bash
# Simple terminal script for submitting stuff to your git repository.

ADDFILES=$(git add -A);
read -r -p "Commit message: "  COMMIT_MESSAGE
COMMIT=$(git commit -m "$COMMIT_MESSAGE");

echo $ADDFILES
echo $COMMIT

read -p "Push with tags (y/n)? " answer
if [ "$answer" != "${answer#[Yy]}" ] ;then
    read -r -p "Enter tag message: "  TAG_M
    git tag -a v${new_ver} -m "$TAG_M"
    PUSH_WT=$(git push -u --tags origin master);
    echo $PUSH_WT
else
    PUSH=$(git push -u origin master);
    echo $PUSH
fi