import React from "react";
import "./App.css";

const Header = () => (
  <header className="header">
    <div className="container">
      <a href="/" className="logo">Team N</a>
      <nav className="nav">
        <a href="#about" className="nav-link">About</a>
        <a href="#team" className="nav-link">Team</a>
        <a href="https://github.com/CS4091/TEAM_N" className="button">View on GitHub</a>
      </nav>
    </div>
  </header>
);

export default Header;
