"use client";

import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";

type FireVideoFeatureProps = {
  id: "O6Vayv9FCLM" | "XpZemPMRkDw";
  kicker: string;
  title: string;
  publisher: string;
  context: string;
  watchFor: string[];
  sourceUrl: string;
};

export default function FireVideoFeature({ id, kicker, title, publisher, context, watchFor, sourceUrl }: FireVideoFeatureProps) {
  const [playing, setPlaying] = useState(false);
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;

  return <aside className="fire-video-feature" aria-label={`${title} video`}>
    <div className="fire-video-frame">
      {playing ? <iframe
        title={title}
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&cc_load_policy=1`}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      /> : <button type="button" className="fire-video-poster" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
        <span className="fire-video-poster-image" style={{ backgroundImage: `linear-gradient(90deg,rgba(14,32,25,.25),rgba(14,32,25,.05)),url(https://i.ytimg.com/vi/${id}/hqdefault.jpg)` }} />
        <span className="fire-video-play"><Play size={28} fill="currentColor" aria-hidden="true" /></span>
        <span className="fire-video-poster-caption">Play the film <span aria-hidden="true">↗</span></span>
      </button>}
    </div>
    <div className="fire-video-note">
      <span className="fire-eyebrow">{kicker}</span>
      <h3>{title}</h3>
      <p className="fire-video-publisher">{publisher}</p>
      <p>{context}</p>
      <div className="fire-video-watch"><strong>Notice as you watch</strong><ul>{watchFor.map(point => <li key={point}>{point}</li>)}</ul></div>
      <div className="fire-video-links"><a href={watchUrl} target="_blank" rel="noopener noreferrer">Watch on YouTube <ArrowUpRight size={15} /></a><a href={sourceUrl} target="_blank" rel="noopener noreferrer">Publisher’s context <ArrowUpRight size={15} /></a></div>
    </div>
  </aside>;
}
