#!/usr/bin/env bash

# Simple fallback script to create a tree2dir demo GIF
# This script creates a series of PNG screenshots that can be combined into a GIF

set -e

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
echo -e "${GREEN}=== Simple tree2dir Demo GIF Creator ===${NC}"

# Check if ImageMagick is installed
if command -v magick &> /dev/null; then
    MAGICK_CMD="magick"
elif command -v convert &> /dev/null; then
    MAGICK_CMD="convert"
else
    echo -e "${YELLOW}ImageMagick not found. Please install it first.${NC}"
    echo "For Mac: brew install imagemagick"
    echo "For Ubuntu: sudo apt install imagemagick"
    exit 1
fi

# Create a temporary directory for our demo
TEMP_DIR=$(mktemp -d)
echo -e "${GREEN}Created temporary directory: ${TEMP_DIR}${NC}"
cd "$TEMP_DIR"

# Create the image directory
mkdir -p images

# Create example ASCII tree files
cat > mini-example.txt << EOF
myProject/
├── README.md
├── src/
│   ├── main.js
│   └── utils/
│       └── helpers.js
└── package.json
EOF

# Create frame capture function
capture_frame() {
    local frame_num=$(printf "%03d" $1)
    $MAGICK_CMD -size 800x500 xc:black -font "Courier" -pointsize 14 -fill white \
        -draw "text 20,30 '$2'" \
        "images/frame_${frame_num}.png"
    sleep 0.5
}

# Create individual frames showing tree2dir in action
echo -e "${GREEN}Creating frames...${NC}"

# Frame 1: Welcome screen
capture_frame 1 "Welcome to tree2dir - Directory Structure Generator"

# Frame 2: Showing npx command
capture_frame 2 "$ npx tree2dir generate"

# Frame 3: Pasting ASCII tree
capture_frame 3 "$ npx tree2dir generate
Please paste your ASCII tree (Press Ctrl+D when finished):

myProject/
├── README.md
├── src/
│   ├── main.js
│   └── utils/
│       └── helpers.js
└── package.json"

# Frame 4: Generating structure
capture_frame 4 "$ npx tree2dir generate
Please paste your ASCII tree (Press Ctrl+D when finished):

myProject/
├── README.md
├── src/
│   ├── main.js
│   └── utils/
│       └── helpers.js
└── package.json

Generating structure..."

# Frame 5: Structure created
capture_frame 5 "$ npx tree2dir generate
Please paste your ASCII tree (Press Ctrl+D when finished):

myProject/
├── README.md
├── src/
│   ├── main.js
│   └── utils/
│       └── helpers.js
└── package.json

Generating structure...
✅ Created directory: myProject
✅ Created file: myProject/README.md
✅ Created directory: myProject/src
✅ Created file: myProject/src/main.js
✅ Created directory: myProject/src/utils
✅ Created file: myProject/src/utils/helpers.js
✅ Created file: myProject/package.json
✅ Structure generated successfully!"

# Frame 6: Checking the structure
capture_frame 6 "$ find myProject -type f | sort
myProject/README.md
myProject/package.json
myProject/src/main.js
myProject/src/utils/helpers.js"

# Frame 7: Using file input
capture_frame 7 "$ npx tree2dir generate -f mini-example.txt
Reading file: mini-example.txt
Parsing ASCII tree...
Generating structure..."

# Frame 8: Dry run example
capture_frame 8 "$ npx tree2dir generate -f mini-example.txt --dry-run
Reading file: mini-example.txt
Parsing ASCII tree...
DRY RUN: Structure preview (no files will be created)
📂 myProject
  📄 README.md
  📂 src
    📄 main.js
    📂 utils
      📄 helpers.js
  📄 package.json
✅ Dry run completed successfully!"

# Frame 9: Custom output directory
capture_frame 9 "$ mkdir custom-output
$ npx tree2dir generate -f mini-example.txt -o ./custom-output
Reading file: mini-example.txt
Parsing ASCII tree...
Generating structure in ./custom-output...
✅ Structure generated successfully in custom-output!"

# Frame 10: Final result
capture_frame 10 "$ ls -la
total 16
drwxr-xr-x  5 user  user  160 May 10 14:30 .
drwxr-xr-x  3 user  user   96 May 10 14:20 ..
drwxr-xr-x  3 user  user   96 May 10 14:30 custom-output
-rw-r--r--  1 user  user  120 May 10 14:25 mini-example.txt
drwxr-xr-x  4 user  user  128 May 10 14:23 myProject"

# Frame 11: Conclusion
capture_frame 11 "Thanks for watching! Get started with:
npx tree2dir generate"

# Create the GIF from the frames
echo -e "${GREEN}Creating GIF from frames...${NC}"
$MAGICK_CMD -delay 150 -loop 0 images/frame_*.png "$SCRIPT_DIR/tree2dir-demo.gif"

# Optimize the GIF
echo -e "${GREEN}Optimizing GIF...${NC}"
if command -v gifsicle &> /dev/null; then
    gifsicle -O3 "$SCRIPT_DIR/tree2dir-demo.gif" -o "$SCRIPT_DIR/tree2dir-demo.gif"
else
    echo -e "${YELLOW}gifsicle not found. Skipping optimization.${NC}"
fi

# Clean up
echo -e "${GREEN}Cleaning up...${NC}"
rm -rf "$TEMP_DIR"

echo -e "${GREEN}Done! GIF created at: $SCRIPT_DIR/tree2dir-demo.gif${NC}"
echo "File size: $(du -h "$SCRIPT_DIR/tree2dir-demo.gif" | cut -f1)" 