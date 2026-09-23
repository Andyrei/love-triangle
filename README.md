# The Compatibility Matrix

An interactive relationship profile visualizer inspired by Sternberg's Triangular Theory of Love. It helps you model a person or a couple across three dimensions: Mind, Heart, and Body, then explore how those values affect compatibility, chemistry, emotional dynamics, and relationship archetypes.

This project is built as a lightweight static web app using HTML, CSS, and JavaScript, with no backend or install step required beyond serving the files locally.

## Overview

The app presents a triangular relationship map where each axis represents a different type of attraction or connection:

- Mind: intellectual compatibility, curiosity, shared values, and communication
- Heart: emotional intimacy, trust, affection, and security
- Body: physical chemistry, sensual attraction, and passion

By adjusting the sliders or dragging within the interactive canvas, users can see how a relationship profile changes in real time. In partner mode, the app compares two profiles and calculates a rough compatibility score and relationship dynamic.

## Features

- Interactive triadic visualization with draggable calibration nodes
- Adjustable sliders for Mind, Heart, and Body intensity
- Single profile mode and partner comparison mode
- Preset relationship archetypes based on Sternberg's framework and pop-culture examples
- Dynamic summary cards for relationship state, strengths, challenges, and advice
- Match score and compatibility analysis for two-person comparisons
- Clipboard snapshot export for sharing a relationship summary
- Local state persistence in the browser via localStorage
- Responsive design for desktop and mobile screens

## Project Files

- [index.html](index.html): app structure and UI layout
- [style.css](style.css): visual styling, gradients, animations, and slider themes
- [script.js](script.js): app logic, presets, calculations, interactivity, and state handling

## How to Run It

Because this is a static site, you can run it in either of these ways:

### Option 1: Open directly

Open [index.html](index.html) in a browser.

### Option 2: Serve locally

From the project folder, run:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## How to Use

### Single profile mode

- Select "Single Profile"
- Adjust the sliders for Mind, Heart, and Body
- Drag inside the matrix to recalibrate the profile visually
- Review the generated relationship state, strengths, challenge, and advice

### Partner comparison mode

- Switch to "Partner Comparison"
- Choose whether you are editing Person A or Person B
- Adjust each profile separately
- View the match score, delta, and compatibility archetype

### Presets

The app includes curated presets such as:

- Consummate Love
- Romantic Love
- Companionate Love
- Infatuation
- Pure Liking
- Empty Love
- Pop-culture duo archetypes

Use them to quickly explore different relationship patterns.

### Export snapshot

Click "Export Snapshot" to copy a textual relationship summary to your clipboard.

## Relationship Model

The app is based on a simplified but expressive interpretation of love as three interdependent axes:

- Mind = intellectual chemistry, mutual understanding, and compatibility of ideas
- Heart = emotional security, empathy, affection, and attachment
- Body = attraction, passion, physical chemistry, and sensual energy

Different combinations create different relationship states. For example:

- High Mind + High Heart + High Body = highly complete or consummate harmony
- High Mind + High Heart + low Body = deep companionship without strong physical chemistry
- High Body + low Mind + low Heart = attraction without deeper relational foundations

## Why It Is Useful

This kind of model is helpful for:

- exploring relationship dynamics in a playful, thoughtful way
- understanding how balance or imbalance affects compatibility
- discussing attraction, chemistry, and emotional needs with more clarity
- generating a quick structured snapshot of a relationship profile

## Customization Ideas

You can extend the app by adding:

- real user profile persistence with a backend
- saved favorite combinations
- richer compatibility formulas
- a dark/light mode toggle
- export as JSON or image
- localized labels or multilingual support

## Browser Compatibility

This app is built with modern web standards and works best in current versions of:

- Chrome
- Edge
- Firefox
- Safari

## Notes

This project is intentionally lightweight and conceptual. It is not a clinical or scientific tool for relationship diagnosis. It is instead a creative, educational, and exploratory interaction inspired by relationship theory.

## License

No license file is currently included in the project. If you plan to share or publish this app, consider adding an open-source license such as MIT.

## Contributing

If you want to improve the project:

1. Fork or clone the repository
2. Make a focused change
3. Test it in a browser
4. Submit a pull request with a clear explanation

## Summary

The Compatibility Matrix is a visually rich and interactive way to explore how emotional, intellectual, and physical dimensions shape relationship dynamics. It is easy to run, easy to modify, and useful for both playful exploration and educational demos.


