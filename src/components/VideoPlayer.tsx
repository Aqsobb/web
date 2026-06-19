import { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface Props {
  url: string;
  title?: string;
}

export default function VideoPlayer({ url, title }: Props) {
  const [hasError, setHasError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [showExternal, setShowExternal] = useState(false);

  if (!url) {
    return (
      <div className="aspect-video rounded-xl bg-dark-700 flex flex-col items-center justify-center gap-3">
        <AlertCircle className="w-10 h-10 text-muted" />
        <p className="text-text-secondary text-sm">No video source available</p>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className="relative aspect-video rounded-xl overflow-hidden bg-dark-800 group shadow-2xl shadow-black/30"
    >
      {!isReady && !hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-dark-800 z-10">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading player...</p>
        </div>
      )}

      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-dark-800 z-10">
          <AlertCircle className="w-12 h-12 text-red-400" />
          <div className="text-center">
            <p className="text-text-primary font-semibold">Failed to load video</p>
            <p className="text-text-secondary text-sm mt-1">
              The video source might be unavailable or restricted
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setHasError(false);
                setIsReady(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
            <button
              onClick={() => setShowExternal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700/50 text-text-secondary border border-white/10 hover:bg-dark-700 transition-all text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              Open Direct
            </button>
          </div>
        </div>
      ) : (
        <>
          <ReactPlayer
            src={url}
            width="100%"
            height="100%"
            controls
            playing={false}
            playsInline
            onError={() => setHasError(true)}
            onReady={() => setIsReady(true)}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
          {/* External link button */}
          <button
            onClick={() => setShowExternal(true)}
            className="absolute top-3 right-3 z-20 p-2 rounded-lg bg-dark-900/60 backdrop-blur-sm text-text-secondary hover:text-text-primary hover:bg-dark-900/80 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </>
      )}

      {/* External link modal */}
      {showExternal && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-dark-900/90 backdrop-blur-sm">
          <div className="glass-effect rounded-2xl p-6 max-w-md text-center">
            <ExternalLink className="w-10 h-10 text-primary mx-auto mb-3" />
            <h3 className="text-text-primary font-semibold mb-2">Open Video Link</h3>
            <p className="text-text-secondary text-sm mb-4 break-all">{url}</p>
            <div className="flex gap-3 justify-center">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-dark transition-all text-sm"
              >
                Open in New Tab
              </a>
              <button
                onClick={() => setShowExternal(false)}
                className="px-4 py-2 rounded-lg bg-dark-700/50 text-text-secondary border border-white/10 hover:bg-dark-700 transition-all text-sm cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 gradient-overlay z-10 pointer-events-none">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
      )}
    </div>
  );
}
