import React from "react";
import { Link } from "react-router-dom";
import { TbPlayerPlayFilled } from "react-icons/tb";
import { imageUrl } from "../../../spotify/format";

export function MediaCard({
  to,
  title,
  subtitle,
  images,
  round = false,
  onPlay,
  meta,
}) {
  const cover = imageUrl(images, "medium");
  const inner = (
    <>
      <div className={`spk-card-art ${round ? "is-round" : ""}`}>
        {cover ? <img src={cover} alt="" /> : <span className="spk-card-fallback" />}
        {onPlay && (
          <button
            type="button"
            className="spk-card-play"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onPlay();
            }}
            aria-label={`Play ${title}`}
          >
            <TbPlayerPlayFilled />
          </button>
        )}
      </div>
      <strong>{title}</strong>
      {subtitle && <span>{subtitle}</span>}
      {meta && <small>{meta}</small>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className="spk-card">
        {inner}
      </Link>
    );
  }

  return <article className="spk-card">{inner}</article>;
}
