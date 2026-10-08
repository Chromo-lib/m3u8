import React from 'react';

export default function About() {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-1 font-semibold text-white">Demo website</h4>
        <a className="text-[#eed75f] hover:underline" rel="noopener noreferrer" href="https://m3u8-media.netlify.app">
          m3u8 media
        </a>
      </div>

      <div>
        <h4 className="mb-1 font-semibold text-white">Built with</h4>
        <a className="text-[#eed75f] hover:underline" href="https://github.com/video-dev/hls.js">
          hls.js
        </a>
      </div>

      <div>
        <h4 className="mb-1 font-semibold text-white">Created with love by</h4>
        <a className="text-[#eed75f] hover:underline" rel="noopener noreferrer" href="https://twitter.com/HaikelFazzani">
          Haikel Fazzani
        </a>
      </div>
    </div>
  );
}
