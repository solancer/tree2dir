# tree2dir Demo Assets

This directory contains assets and scripts for creating demos of the tree2dir CLI tool.

## Demo Files

- `tree2dir-logo.png` - The official logo for tree2dir
- `tree2dir-demo.cast` - Asciinema recording of a demo session showing tree2dir in action
- `tree2dir-demo.gif` - GIF version of the demo (may not include all colors/emojis from the terminal)

## Creating Demos

### Asciinema Method (Recommended)

The `asciinema-demo.sh` script creates a high-quality terminal recording with proper colors and emoji support:

1. Run the script:
   ```
   ./asciinema-demo.sh
   ```

2. This creates:
   - A `.cast` file (terminal recording)
   - A demo directory with the example files

3. View the recording:
   ```
   asciinema play Stuff/tree2dir-demo.cast
   ```

4. Share the recording:
   ```
   asciinema upload Stuff/tree2dir-demo.cast
   ```

### Converting to GIF

To convert the asciinema recording to a GIF, use the asciinema GIF generator tool (agg):

1. Install agg:
   ```
   npm install -g asciinema-gif
   ```

2. Convert from a local .cast file:
   ```
   agg Stuff/tree2dir-demo.cast Stuff/tree2dir-demo.gif
   ```

3. Or convert directly from an asciinema.org URL:
   ```
   agg https://asciinema.org/a/jqx72MevZmgJeXSapNH4Bxa5C Stuff/tree2dir-demo.gif
   ```

4. Customize the GIF with additional options:
   ```
   agg --theme monokai --speed 1.5 --font-size 12 Stuff/tree2dir-demo.cast Stuff/tree2dir-demo.gif
   ```

Run `agg --help` to see all available options for customizing the GIF output. You can adjust:
- Font family and size
- Color theme
- Playback speed
- Frame rate
- Window padding
- And more

For full documentation, visit the [agg GitHub repository](https://github.com/asciinema/agg).

## Embedding in README.md

After generating the demo assets, you can embed them in your project's README.md:

### Option 1: GIF Animation (Recommended for GitHub)

Using the GIF version provides a self-contained animation that plays automatically - this is the approach currently used in the main README.md:

```markdown
<div align="center">
    <img src="Stuff/tree2dir-demo.gif" width="600" alt="tree2dir CLI demo">
</div>
```

This approach works well for GitHub and other platforms that support GIF animations.

### Option 2: Asciinema Link

If you've uploaded to asciinema.org, you can also link to the recording:

```markdown
[![asciicast](https://asciinema.org/a/jqx72MevZmgJeXSapNH4Bxa5C.svg)](https://asciinema.org/a/jqx72MevZmgJeXSapNH4Bxa5C)
```

This creates a clickable thumbnail that takes users to the interactive asciinema player. 