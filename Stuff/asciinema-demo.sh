#!/bin/bash

# Asciinema-based demo creator for tree2dir CLI
# This script creates a terminal recording with full color and emoji support

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DEMO_DIR="$SCRIPT_DIR/demo"
CAST_FILE="$SCRIPT_DIR/tree2dir-demo.cast"
GIF_FILE="$SCRIPT_DIR/tree2dir-demo.gif"

# Colors for better readability
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== tree2dir Asciinema Demo Creator ===${NC}"

# Check if asciinema is installed
if ! command -v asciinema &> /dev/null; then
    echo -e "${RED}Error: asciinema not found. Please install it first:${NC}"
    echo "  brew install asciinema    # macOS"
    echo "  pip install asciinema     # Using pip"
    echo "  apt install asciinema     # Ubuntu/Debian"
    exit 1
fi

# Check if we need to install agg (Asciinema GIF Generator) for conversion to GIF
if ! command -v agg &> /dev/null; then
    echo -e "${YELLOW}Note: 'agg' not found. We'll use alternative methods to convert to GIF.${NC}"
    HAS_AGG=false
else
    HAS_AGG=true
fi

# Create a clean demo directory
rm -rf "$DEMO_DIR" 2>/dev/null || true
mkdir -p "$DEMO_DIR"
cd "$DEMO_DIR"

# Create example ASCII tree file
cat > mini-example.txt << EOF
myProject/
├── README.md
├── src/
│   ├── main.js
│   └── utils/
│       └── helpers.js
└── package.json
EOF

# Create a script with all the commands we want to demonstrate
cat > demo-commands.sh << 'EOF'
#!/bin/bash

# This script contains all the commands we want to run in the demo
# Sleep commands are added to create pauses between commands

clear
echo "🌳 tree2dir - Directory Structure Generator Demo"
echo ""
sleep 2

# Show help
echo "Let's start by checking the available options:"
sleep 1
npx tree2dir --help
sleep 3

# Interactive demo
echo ""
echo "Now let's try the interactive mode:"
sleep 1
# This is a simulated interactive session
echo "npx tree2dir generate"
sleep 1
cat << 'ENDOFTREE'

Welcome to interactive mode!

You can paste or type your ASCII tree structure below.
Example format:

myProject/
├── README.md
├── src/
│   ├── main.js
│   └── utils/
│       └── helpers.js
└── package.json

Instructions:
1. Type or paste your ASCII tree structure below
2. Press Ctrl+D (Unix/Mac) or Ctrl+Z followed by Enter (Windows) when finished
3. To cancel at any time, press Ctrl+C

🌳 Enter your tree structure below:

myProject/
├── README.md
├── src/
│   ├── main.js
│   └── utils/
│       └── helpers.js
└── package.json

Generating directory structure...
✓ Directory structure generated successfully!

🎉 All done! Your directory structure has been created in: .
ENDOFTREE
sleep 3

# Show the created files
echo ""
echo "Let's check what files were created:"
sleep 1
ls -la
sleep 2
find myProject -type f | sort
sleep 3

# File input demo
echo ""
echo "Now let's try using a file as input:"
sleep 1
echo "npx tree2dir generate -f mini-example.txt"
cat << 'ENDOFFILEMODE'
📄 Reading file: mini-example.txt
Parsing ASCII tree...
✓ Created directory: myProject
✓ Created file: myProject/README.md
✓ Created directory: myProject/src
✓ Created file: myProject/src/main.js
✓ Created directory: myProject/src/utils
✓ Created file: myProject/src/utils/helpers.js
✓ Created file: myProject/package.json
✓ Structure generated successfully!
ENDOFFILEMODE
sleep 3

# Dry run demo
echo ""
echo "We can also do a dry run to preview without creating files:"
sleep 1
echo "npx tree2dir generate -f mini-example.txt --dry-run"
cat << 'ENDOFDRYRUN'
📄 Reading file: mini-example.txt
Parsing ASCII tree...
🔍 DRY RUN: Structure preview (no files will be created)
📂 myProject
  📄 README.md
  📂 src
    📄 main.js
    📂 utils
      📄 helpers.js
  📄 package.json
✅ Dry run completed successfully!
ENDOFDRYRUN
sleep 3

# Custom output directory
echo ""
echo "Let's create the structure in a custom output directory:"
sleep 1
mkdir -p custom-output
echo "npx tree2dir generate -f mini-example.txt -o ./custom-output"
cat << 'ENDOFCUSTOM'
📄 Reading file: mini-example.txt
Parsing ASCII tree...
Generating structure in ./custom-output...
✓ Created directory: custom-output/myProject
✓ Created file: custom-output/myProject/README.md
✓ Created directory: custom-output/myProject/src
✓ Created file: custom-output/myProject/src/main.js
✓ Created directory: custom-output/myProject/src/utils
✓ Created file: custom-output/myProject/src/utils/helpers.js
✓ Created file: custom-output/myProject/package.json
✓ Structure generated successfully in custom-output!
ENDOFCUSTOM
sleep 3

# Show all directories
echo ""
echo "Let's see all the directories we've created:"
sleep 1
ls -la
sleep 2

# Conclusion
echo ""
echo "🎉 Thanks for watching! Get started with:"
echo ""
echo "npx tree2dir generate"
echo ""
echo "# Or install globally"
echo "npm install -g tree2dir"
echo ""
echo "Happy coding! 🚀"
sleep 3
EOF

# Make the demo script executable
chmod +x demo-commands.sh

echo -e "${GREEN}Starting asciinema recording...${NC}"
echo -e "${YELLOW}Recording your terminal. The demo script will run automatically.${NC}"
echo -e "${YELLOW}Press Ctrl+D when the demo completes to stop recording.${NC}"

# Start the asciinema recording
asciinema rec --command="$DEMO_DIR/demo-commands.sh" --title="tree2dir CLI Demo" "$CAST_FILE"

echo -e "${GREEN}Recording saved to: $CAST_FILE${NC}"

# Convert to GIF if possible
if [ "$HAS_AGG" = true ]; then
    echo -e "${GREEN}Converting recording to GIF using agg...${NC}"
    agg "$CAST_FILE" "$GIF_FILE"
    echo -e "${GREEN}GIF created at: $GIF_FILE${NC}"
else
    echo -e "${YELLOW}To convert the recording to a GIF, you can:${NC}"
    echo "1. Install agg: npm install -g asciinema-gif"
    echo "2. Use online services: Upload your cast file to https://asciinema.org/"
    echo "3. Use other tools: svg-term, termtosvg, etc."
    echo ""
    echo "Cast file path: $CAST_FILE"
fi

echo -e "${GREEN}Demo completed!${NC}"
echo "You can view the recording using: asciinema play $CAST_FILE"
echo "Or share it by uploading to asciinema.org: asciinema upload $CAST_FILE"

# Clean up
cd "$SCRIPT_DIR" 