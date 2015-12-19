#! /bin/bash
#code-push release Bunches ./release 1.0.3

rm ./release/main.jsbundle &&

react-native bundle \
--dev false \
--minify \
--resetCache true \
--platform ios \
--entry-file index.ios.js \
--bundle-output ./release/main.jsbundle \
--assets-dest ./release