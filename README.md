# Bunches
Convient conversations for people with shared interests. Faimly, friends, co-workers, classmates, sports teams, etc...


## Run Locally
`npm install react-native-cli -g`

`npm install`

* Run server - AppDelegate.m to point to correct IP (localhost for emualtor, mac's ip for iphone)

`npm start`


## Deploy
1. Bump package.json app version
2. Bump xcode project app version
3. Make sure AppDelegate.m is using `jsCodeLocation = [CodePush bundleURL];` 
4. `sh scripts/bundle.sh`
5. `sh scripts/release.sh`
6. `code-push release Bunches ./release 1.0.0` change version to whichever version needs to be deployed.




