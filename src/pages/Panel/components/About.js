import React from 'react'

export default function About() {
  return (<>
    <div className='mb-1'>
      <h4 className='mt-0'>Demo website</h4>
      <a className='white' rel="noopener noreferrer" href='https://m3u8-media.netlify.app'>m3u8 media</a>
    </div>

    <div className='mb-1'>
      <h4>Built with</h4>
      <a className='white' href='https://github.com/video-dev/hls.js'>hls.js</a>
    </div>

    <div className='mb-1'>
      <h4>Created with love by</h4>
      <a className='white' rel="noopener noreferrer" href='https://twitter.com/HaikelFazzani'>Haikel Fazzani</a>
    </div>
  </>)
}
