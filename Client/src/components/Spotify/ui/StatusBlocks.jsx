import React from "react";

export function LoadingSkeleton({ label = "Loading…" }) {
  return (
    <div className="spk-state" role="status">
      <div className="spk-skeleton-grid" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p>{label}</p>
    </div>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="spk-state">
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Couldn't load this", body, onRetry }) {
  return (
    <div className="spk-state spk-state-error" role="alert">
      <h3>{title}</h3>
      {body && <p>{body}</p>}
      {onRetry && (
        <button type="button" className="spk-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
