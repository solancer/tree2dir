# tree2dir Assets

This directory contains assets for the tree2dir project.

## Contents

- `tree2dir-logo.png` - Project logo used in the README
- `tree2dir-demo.gif` - Demo GIF showing how to use tree2dir
- `simple-gif-maker.sh` - Script to regenerate the demo GIF if needed
- `example.txt` - Example ASCII tree structure for testing

## Updating the Demo GIF

If you need to update the demo GIF, run the `simple-gif-maker.sh` script:

```bash
./simple-gif-maker.sh
```

Requirements:
- ImageMagick (`magick` or `convert` command)
- gifsicle (optional, for optimization)

Install on macOS:
```bash
brew install imagemagick gifsicle
```

Install on Ubuntu:
```bash
sudo apt install imagemagick gifsicle
``` 