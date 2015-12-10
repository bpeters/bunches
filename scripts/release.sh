#! /bin/bash

react-native bundle \
--dev false \
--minify \
--resetCache true \
--platform ios \
--entry-file index.ios.js \
--bundle-output ./release/main.jsbundle \
--assets-dest ./release