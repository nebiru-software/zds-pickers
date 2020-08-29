# ZDS Shifter Pro Firmware

Built for use on the [PlatformIO](https://github.com/platformio/platformio-atom-ide) system (requires [Atom](https://github.com/atom/atom)) or [VSCode](https://code.visualstudio.com/)

Current build is for Arduino [Pro Micro](https://www.sparkfun.com/products/12640) (5V/16MHz)

**NOTE:** Pro Micro RESET pin must be "double clicked" during upload.

Make sure all `DEBUG_MODE` flags are set to `0` prior to building release.

Copy over the `zds_shifter_pro.json` file to `~/.platformio/platforms/atmelavr/boards`

Compiled firmware can be found in this [hidden folder](./.pioenvs/sparkfun_promicro16/firmware.hex).
