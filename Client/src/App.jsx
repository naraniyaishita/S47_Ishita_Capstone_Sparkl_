import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import WelcomePage from "./components/WelcomePage";
import RegistrationPage from "./components/AuthPages/RegistrationPage";
import LoginPage from "./components/AuthPages/LoginPage";
import HomePage from "./components/HomePage";

import Blogs from "./components/Pages/Blogs";
import Bookshelf from "./components/Pages/Bookshelf";
import Watchlist from "./components/Pages/Watchlist";
import Blog from "./components/Pages/Blog";
import About from "./components/Pages/About";

import AddBlog from "./components/Pages/AddBlog";
import AddBook from "./components/Pages/AddBook";
import AddBookForm from "./components/Pages/AddBookForm";
import AddWatch from "./components/Pages/AddWatchlist";
import AddWatchlistForm from "./components/Pages/AddWatchlistForm";

import EditWatch from "./components/Pages/EditWatch";

import GoogleSuccess from "./components/AuthPages/GoogleSucess";
import MusicRoute from "./components/MusicRoute";
import SearchPage from "./components/Spotify/pages/SearchPage";
import LibraryPage from "./components/Spotify/pages/LibraryPage";
import PlaylistDetail from "./components/Spotify/pages/PlaylistDetail";
import AlbumDetail from "./components/Spotify/pages/AlbumDetail";
import ArtistDetail from "./components/Spotify/pages/ArtistDetail";
import TastePage from "./components/Spotify/pages/TastePage";
import DiscoverPage from "./components/Spotify/pages/DiscoverPage";
import SettingsPage from "./components/Spotify/pages/SettingsPage";
import SpotifyHome from "./components/Spotify/pages/SpotifyHome";
import { SpotifyProvider } from "./spotify/SpotifyProvider";

const routes = [
  { path: "/", element: <WelcomePage /> },
  { path: "/register", element: <RegistrationPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/home", element: <HomePage /> },
  { path: "/blogs", element: <Blogs /> },
  { path: "/blogs/:id", element: <Blog /> },
  { path: "/bookshelf", element: <Bookshelf /> },
  { path: "/watchlist", element: <Watchlist /> },
  { path: "/blogs/add", element: <AddBlog /> },
  { path: "/books/add", element: <AddBook /> },
  { path: "/books/add/form", element: <AddBookForm /> },
  { path: "/watchlist/add/form", element: <AddWatchlistForm /> },
  { path: "/watchlist/add", element: <AddWatch /> },
  { path: "/watchlist/:id/edit", element: <EditWatch /> },
  { path: "/google-success", element: <GoogleSuccess /> },
];

function App() {
  return (
    <SpotifyProvider>
      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        <Route path="/spotify" element={<MusicRoute />}>
          <Route index element={<SpotifyHome />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="library" element={<LibraryPage />} />
          <Route path="playlists/:id" element={<PlaylistDetail />} />
          <Route path="albums/:id" element={<AlbumDetail />} />
          <Route path="artists/:id" element={<ArtistDetail />} />
          <Route path="taste" element={<TastePage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </SpotifyProvider>
  );
}

export default App;
