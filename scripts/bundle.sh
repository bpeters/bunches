#! /bin/bash

react-native bundle \
--dev false \
--minify \
--resetCache true \
--entry-file=index.ios.js \
--platform=ios \
--bundle-output ./ios/main.jsbundle