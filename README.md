# HLS Streaming Player

A browser-based HLS player for built-in and user-added HLS playlists. It uses [hls.js](https://github.com/video-dev/hls.js) for adaptive streaming and Tailwind CSS v4 for the interface.

## Features

- Play the built-in stream or add another HLS playlist using its URL and a display name.
- Save added streams in the browser and switch between them from the channel list.
- Select automatic or available video quality renditions.
- Inspect playback state, stream type, resolution, codecs, frame rate, bitrate, estimated bandwidth, forward buffer, live latency, and dropped frames in the collapsible **Stream diagnostics** panel.
- Record the currently playing media in a browser-supported format and download it when recording stops.

Recording captures playback from the video element; it does not download the original HLS playlist or all source segments. Recording availability and output format depend on browser support.

## Development

Requires Node.js and npm.

```sh
npm install
npm run dev
```

Create a production build with:

```sh
npm run build
```

## GitHub Pages

The `Deploy to GitHub Pages` workflow builds and deploys the site when changes are pushed to `main`, or when started manually from the Actions tab. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. After the first successful deployment, the site is available at <https://chromo-lib.github.io/m3u8/>.

## Browser notes

Browsers with Media Source Extensions use hls.js. Browsers that provide native HLS playback use their built-in player. HLS playback may also depend on the stream server allowing cross-origin (CORS) requests from this app.
