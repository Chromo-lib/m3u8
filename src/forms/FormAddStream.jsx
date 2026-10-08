import React, { useState } from 'react';
import useChannels from '../store/useChannels';
import useCurrentChannel from '../store/useCurrentChannel';
import useModal from '../store/useModal';
import PlayIcon from '../icons/PlayIcon';

export default function FormAddStream() {
  const [, channelsActions] = useChannels();
  const [, currentChannelActions] = useCurrentChannel();
  const [, modalActions] = useModal();
  const [name, setName] = useState('New stream');
  const [url, setUrl] = useState('https://flipfit-cdn.akamaized.net/flip_hls/661f570aab9d840019942b80-473e0b/video_h1.m3u8');
  const [error, setError] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    setError('');

    try {
      const stream = channelsActions.addStream({ name, url });
      currentChannelActions.set(stream);
      modalActions.toggle();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/65" htmlFor="stream-name">
        Stream name
        <input
          id="stream-name"
          className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm font-normal normal-case tracking-normal text-white placeholder:text-white/40 focus:border-[#eed75f]/60 focus:outline-none"
          type="text"
          name="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="My HLS stream"
          required
          autoFocus
        />
      </label>

      <label className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/65" htmlFor="stream-url">
        HLS playlist URL
        <input
          id="stream-url"
          className="mt-1 w-full rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-sm font-normal normal-case tracking-normal text-white placeholder:text-white/40 focus:border-[#eed75f]/60 focus:outline-none"
          type="url"
          name="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://flipfit-cdn.akamaized.net/flip_hls/661f570aab9d840019942b80-473e0b/video_h1.m3u8"
          required
        />
      </label>

      {error && (
        <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs text-red-200">
          {error}
        </p>
      )}

      <button
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#eed75f] px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#111] transition hover:opacity-90"
        type="submit"
      >
        <PlayIcon />
        Add and play stream
      </button>
    </form>
  );
}
