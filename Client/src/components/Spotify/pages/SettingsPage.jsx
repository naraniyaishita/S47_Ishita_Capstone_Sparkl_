import React from "react";
import { useSpotify } from "../../../spotify/SpotifyProvider";
import { getRedirectUri, SPOTIFY_SCOPES } from "../../../spotify/auth";

export default function SettingsPage() {
  const { profile, devices, activeDevice, chooseDevice, logoutSpotify, refreshPlayback } =
    useSpotify();

  return (
    <div className="spk-page-block">
      <header className="spk-page-head">
        <h2>Settings</h2>
        <p>Spotify connection, devices, and what this app can access.</p>
      </header>

      <section className="spk-settings-card">
        <h3>Account</h3>
        <p>{profile?.display_name || "Connected"}</p>
        <p className="spk-meta">
          Subscription level is no longer returned by Spotify for many apps, so
          Sparkl infers Premium limits from playback errors instead of a product badge.
        </p>
        <button type="button" className="spk-btn secondary" onClick={logoutSpotify}>
          Disconnect Spotify
        </button>
      </section>

      <section className="spk-settings-card">
        <h3>Playback device</h3>
        <p className="spk-meta">
          Playback control needs an active Spotify app. Choose a device, then press play.
        </p>
        <button type="button" className="spk-btn secondary" onClick={() => refreshPlayback()}>
          Refresh devices
        </button>
        <ul className="spk-device-list">
          {devices.map((device) => (
            <li key={device.id}>
              <button
                type="button"
                className={device.id === activeDevice?.id ? "is-active" : ""}
                onClick={() => chooseDevice(device.id)}
              >
                {device.name}
                <small>{device.type}{device.is_active ? " · active" : ""}</small>
              </button>
            </li>
          ))}
        </ul>
        {devices.length === 0 && <p>No devices found. Open Spotify on your phone or computer.</p>}
      </section>

      <section className="spk-settings-card">
        <h3>Redirect URI</h3>
        <code>{getRedirectUri()}</code>
        <p className="spk-meta">This must match the Spotify Developer Dashboard exactly.</p>
      </section>

      <section className="spk-settings-card">
        <h3>Requested scopes</h3>
        <p className="spk-meta">{SPOTIFY_SCOPES}</p>
      </section>
    </div>
  );
}
