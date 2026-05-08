import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const STREAM_URL =
  "https://playerservices.streamtheworld.com/api/livestream-redirect/EDGEREWIND_S01AAC.aac";

type PlayerCtx = {
  playing: boolean;
  loading: boolean;
  toggle: () => void;
};

const Ctx = createContext<PlayerCtx | null>(null);

export function StreamPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const audio = new Audio();
    audio.preload = "none";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;
    const onPlay = () => { setPlaying(true); setLoading(false); };
    const onPause = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => setLoading(false);
    const onError = () => { setPlaying(false); setLoading(false); };
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("error", onError);
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      return;
    }
    setLoading(true);
    audio.src = `${STREAM_URL}?t=${Date.now()}`;
    try {
      await audio.play();
    } catch {
      setLoading(false);
    }
  };

  return <Ctx.Provider value={{ playing, loading, toggle }}>{children}</Ctx.Provider>;
}

export function useStreamPlayer(): PlayerCtx {
  const ctx = useContext(Ctx);
  if (!ctx) return { playing: false, loading: false, toggle: () => {} };
  return ctx;
}
