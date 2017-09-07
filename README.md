# cordova-whosonfirst-bookmarks

Too soon. Move along.

## Known knowns

## install

Ach! I forgot where I wrote this down but basically some part of the install process (maybe running an `ios` app...?) will fail with a mysterious permissions error involving a package whose name is something like "gorp" or a suitably nerd-y name. The general consensus on the Internet is that you "just `chmod 777` your node_modules" folder which... is a bad idea. It turns out the problem is actually that there is a subdirectory in the "gorp" source which contains a whole series of shell scripts that needs to be run but are missing their executable bit. So the solution is _not_ to `chmod 777` all the things but rather to `chmod 755 gorp/scripts/*.sh` for some definition of "gorp" and "scripts".

## ios

The `cordova ios run` command will not work with the default version of `ios-sim` that ships by default. You will need to manually upgrade to version `6.0.0` or higher:

```
cd platforms/ios/cordova/node_modules/
npm install ios-sim@latest
cd ../../../../
cordova ios run
```

## See also

* https://github.com/whosonfirst/electron-whosonfirst-bookmarks
