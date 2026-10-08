import React from 'react';
import PlayIcon from '../icons/PlayIcon';

function formatBitrate(bitsPerSecond) {
  if (!Number.isFinite(bitsPerSecond) || bitsPerSecond <= 0) return '—';
  return `${(bitsPerSecond / 1_000_000).toFixed(2)} Mbps`;
}

function formatSeconds(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  return `${seconds.toFixed(1)} s`;
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  const time = [minutes, remainingSeconds]
    .map((part) => String(part).padStart(2, '0'))
    .join(':');

  return hours ? `${String(hours).padStart(2, '0')}:${time}` : time;
}

export default function StreamDiagnostics({ metrics, channel, isRecording, onToggleRecording }) {
  const mode = metrics.isLive == null
    ? 'Reading playlist'
    : metrics.isLive
      ? 'Live HLS'
      : 'Video on demand';
  const rendition = metrics.width && metrics.height
    ? `${metrics.width} × ${metrics.height}`
    : 'Selecting rendition';
  const playbackTime = `${formatTime(metrics.currentTime)} / ${
    metrics.isLive ? 'LIVE' : formatTime(metrics.duration)
  }`;
  const droppedFrames = metrics.droppedFrames == null
    ? '—'
    : `${metrics.droppedFrames}${metrics.totalFrames == null ? '' : ` / ${metrics.totalFrames}`}`;

  const details = [
    ['Player engine', metrics.engine],
    ['Playlist type', mode],
    ['Available renditions', metrics.variants || '—'],
    ['Playing resolution', rendition],
    ['Video codec', metrics.videoCodec || '—'],
    ['Audio codec', metrics.audioCodec || '—'],
    ['Frame rate', metrics.frameRate ? `${metrics.frameRate.toFixed(2)} fps` : '—'],
    ['Rendition bitrate', formatBitrate(metrics.bitrate)],
    ['Estimated bandwidth', formatBitrate(metrics.bandwidth)],
    ['Forward buffer', formatSeconds(metrics.buffer)],
    ['Live latency', metrics.isLive ? formatSeconds(metrics.latency) : '—'],
    ['Distance to sync point', metrics.isLive ? formatSeconds(metrics.liveSyncDistance) : '—'],
    ['Target latency', metrics.targetLatency == null ? '—' : formatSeconds(metrics.targetLatency)],
    ['Playback position', playbackTime],
    ['Dropped / total frames', droppedFrames]
  ];

  return (
    <details className="rounded-2xl border border-white/10 bg-black/20 p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <summary className="min-w-0 flex-1 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <span className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white">
            <PlayIcon width="12" height="12" />
            <span>{channel.name}</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] tracking-normal text-white/75">
              {metrics.status}
            </span>
          </span>
          <span className="mt-1 block break-all text-[11px] text-white/50">
            {channel.url}
          </span>
          <span className="mt-2 block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
            Stream diagnostics
          </span>
          <span className="mt-1 block text-[11px] text-white/50">
            Playback and adaptive bitrate metrics reported by hls.js.
          </span>
        </summary>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className={[
              'rounded-xl px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition hover:opacity-90',
              isRecording ? 'bg-red-500 text-white' : 'bg-[#eed75f] text-[#111]'
            ].join(' ')}
            onClick={onToggleRecording}
          >
            {isRecording ? 'Stop & download' : 'Record stream'}
          </button>
          {metrics.targetDuration > 0 && (
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/60">
              Segment target {formatSeconds(metrics.targetDuration)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3">
        <dl className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {details.map(([label, value]) => (
            <div key={label} className="min-w-0 rounded-xl border border-white/5 bg-white/[0.035] px-3 py-2">
              <dt className="truncate text-[9px] font-semibold uppercase tracking-[0.12em] text-white/45">
                {label}
              </dt>
              <dd className="mt-1 truncate text-xs font-medium text-white/90" title={String(value)}>
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {metrics.error && (
          <p className="mt-3 break-words rounded-xl border border-red-400/20 bg-red-400/5 px-3 py-2 text-xs text-red-200">
            HLS error: {metrics.error}
          </p>
        )}
      </div>
    </details>
  );
}
