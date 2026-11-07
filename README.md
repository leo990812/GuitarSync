# GuitarSync

GuitarSync is a responsive guitar-tab workspace hosted on GitHub Pages.

## Working features
- Songsterr public catalogue search for song and track metadata (not tablature notation).
- In-browser score rendering and playback powered by [alphaTab](https://alphatab.net).
- Import Guitar Pro 3–8 files (`.gp3`, `.gp4`, `.gp5`, `.gpx`, `.gp`, `.gp7`, `.gp8`), MusicXML (`.xml`, `.musicxml`, `.mxl`) and Capella (`.capx`).
- Track selection, play/pause, stop, and playback speed controls.
- ASCII TAB text editor, local browser score library, TXT import/export, and metronome.

## Important limitation
Songsterr's public catalogue endpoint returns song metadata, not the complete note-by-note tablature. GuitarSync does not scrape, bypass paid access, or republish third-party tablature. Automatic online search that returns full scores requires a provider that explicitly licenses score content for third-party display. Until such a provider is integrated, users can load score files they are authorized to use into the in-page alphaTab player.

## alphaTab attribution and license
This application uses [alphaTab](https://alphatab.net), licensed under the Mozilla Public License 2.0 (MPL-2.0). alphaTab is provided by the CoderLine contributors. Its source and license are available at:
- https://github.com/CoderLine/alphaTab
- https://www.mozilla.org/en-US/MPL/2.0/

The alphaTab runtime and its Bravura/SoundFont assets are loaded from jsDelivr at runtime. This project does not modify alphaTab itself.

## Run locally
Open `index.html` in a modern browser. No build step is required.

## Publish with GitHub Pages
1. Open repository Settings.
2. Select Pages.
3. Choose Deploy from a branch, `main`, and `/(root)`.

Published site: https://leo990812.github.io/GuitarSync/
