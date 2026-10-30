import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  TbHome,
  TbSearch,
  TbList,
  TbBooks,
  TbChartBar,
  TbSettings,
} from "react-icons/tb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSpotify } from "../../spotify/SpotifyProvider";
import MiniPlayer from "./MiniPlayer";
import QueueDrawer from "./QueueDrawer";
import SpotifyConnect from "./SpotifyConnect";
import "../Styles/Spotify.css";
import "../Styles/SpotifyApp.css";

const links = [
  { to: "/spotify", label: "Home", icon: TbHome, end: true },
  { to: "/spotify/search", label: "Search", icon: TbSearch },
  { to: "/spotify/queue", label: "Queue", icon: TbList },
  { to: "/spotify/library", label: "Library", icon: TbBooks },
  { to: "/spotify/taste", label: "Your Taste", icon: TbChartBar },
  { to: "/spotify/settings", label: "Settings", icon: TbSettings },
];

export default function SpotifyLayout({ children }) {
  const { token, profile, logoutSpotify, setQueueOpen } = useSpotify();

  if (!token) {
    return (
      <>
        <SpotifyConnect />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="Spotify spk-shell">
      <header className="App-header spk-header">
        <h1>
          <img
            src="https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Full_Logo_RGB_White.png"
            alt="spotify"
            className="SpotifyLogo"
          />
        </h1>
        <div className="SpotifyHeaderActions">
          {profile && (
            <a
              className="SpotifyProfile"
              href={
                profile.external_urls?.spotify ||
                `https://open.spotify.com/user/${profile.id}`
              }
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${profile.display_name || "Spotify"} profile on Spotify`}
            >
              {profile.images?.[1]?.url || profile.images?.[0]?.url ? (
                <img
                  src={profile.images?.[1]?.url || profile.images?.[0]?.url}
                  alt=""
                />
              ) : (
                <span>{(profile.display_name || "S").charAt(0).toUpperCase()}</span>
              )}
              <span>{profile.display_name || "Spotify profile"}</span>
            </a>
          )}
          <button onClick={logoutSpotify} className="SpotifyLogoutButton">
            Logout
          </button>
        </div>
      </header>

      <div className="spk-body">
        <nav className="spk-sidebar" aria-label="Spotify navigation">
          {links.map((link) => {
            const Icon = link.icon;
            if (link.to === "/spotify/queue") {
              return (
                <button
                  key={link.to}
                  type="button"
                  className="spk-nav-link"
                  title={link.label}
                  onClick={() => setQueueOpen(true)}
                >
                  <Icon />
                  <span>{link.label}</span>
                </button>
              );
            }
            return (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `spk-nav-link ${isActive ? "is-active" : ""}`
                }
                title={link.label}
              >
                <Icon />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
        <main className="spk-main">{children || <Outlet />}</main>
      </div>
      <MiniPlayer />
      <QueueDrawer />
      <ToastContainer />
    </div>
  );
}
