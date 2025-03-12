import { FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa"
import "./main_page.css"
import React from 'react'

function ProjectLandingPage() {
  return (
    <div className="landing-page">
      <header className="header">
        <div className="container">
          <a href="/" className="logo">
            Team N
          </a>
          <nav className="nav">
            <a href="#about" className="nav-link">
              About
            </a>
            <a href="#team" className="nav-link">
              Team
            </a>
            <a href="https://github.com/CS4091/TEAM_N" className="button">
              View on GitHub
            </a>
          </nav>
        </div>
      </header>
      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Team N - Boeing Project 3</h1>
              <p>Air-to-Ground Search</p>
              <div className="button-group">
                <a href="#about" className="button primary">
                  About Project
                </a>
                <a href="/app" className="button secondary">
                  Try It Out!
                </a>
              </div>
            </div>
            <div className="hero-image">
              <p>Project Preview</p>
            </div>
          </div>
        </section>

        <section id="about" className="about">
          <div className="container">
            <h2>About the Project</h2>
            <p>
             The Air-to-Ground Search Pathfinding Project focuses on designing an optimal flight path for an aircraft to scan a geographic area using a 2D grid-based world. The aircraft must efficiently navigate the grid while avoiding obstacles, following movement constraints, and maximizing the number of scanned cells. This type of problem is commonly seen in applications such as search-and-rescue operations, geological surveys, and disaster assessment.
              The aircraft has a forward-facing sensor that scans a 2x3 rectangular area ahead, and it has full knowledge of the terrain before beginning its route. The primary goal is to generate a path that avoids obstacles, minimizes movement costs, and ensures at least 80% coverage of the map. The algorithm must also account for dead-end areas, ensuring that the aircraft does not get trapped in box canyons where it cannot turn around.
            </p>
            <div className="features">
              <div className="feature-image">
                <p>Project Details</p>
              </div>
              <ul className="feature-list">
                <li>
                  <h3>Optimized Pathfinding with Coverage Constraints</h3>
                  <p>The aircraft navigates the grid using only forward movements and left/right turns, avoiding obstacles while ensuring at least 80% of the terrain is scanned. The algorithm minimizes movement costs and detects dead-end areas (box canyons) to prevent the aircraft from getting stuck.</p>
                </li>
                <li>
                  <h3>Efficient Sensor-Based Scanning</h3>
                  <p>Equipped with a 2x3 scanning sensor, the aircraft strategically positions itself to maximize coverage while reducing redundant passes. The algorithm ensures efficient data collection by optimizing flight paths to scan as many grid cells as possible.</p>
                </li>
                <li>
                  <h3>Algorithmic Flexibility and Extendability</h3>
                  <p>The project supports different pathfinding heuristics, allowing comparison of algorithms like A* and Greedy search. It can be extended with constraints such as limited movement or multiple aircraft working together. A visualization system can also be added to display paths and scanning efficiency.</p>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section id="team" className="team">
          <div className="container">
            <h2>Meet Our Team</h2>
            <div className="team-grid">
              <TeamMemberCard
                name="Debora &quot;Deb&quot; Andrade"
                role="Frontend Developer"
                bio="Passionate about UI/UX and Frontend developing."
              />
              <TeamMemberCard
                name="Garret Wacker"
                role="Backend Developer"
                bio="Passionate about Embedded Systems and Firmware Design."
              />
              <TeamMemberCard
                name="Jack Madison"
                role="Backend Developer"
                bio="Passionate about System Architecture and Design."
              />
              <TeamMemberCard
                name="Jakob Ferguson"
                role="Backend Developer"
                bio="Passionate about Algorithm Design."
              />
              <TeamMemberCard
                name="Jordan Lewis"
                role="Frontend Developer"
                bio="Passionate about Cybersecurity."
              />
              <TeamMemberCard
                name="Makalyn Kline"
                role="Backend Developer"
                bio="Passionate about Machine Learning and Data Science"
              />
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <h2>Check Out The Repository</h2>
            <div className="social-links">
              <a href="https://github.com/CS4091/TEAM_N" className="social-link">
                <FaGithub />
                <span className="sr-only">GitHub</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
      </footer>
    </div>
  )
}

function TeamMemberCard({ name, role, bio, githubUrl, twitterUrl, emailAddress }) {
  return (
    <div className="team-member-card">
      <div className="member-image">
      </div>
      <div className="member-info">
        <h3>{name}</h3>
        <p className="member-role">{role}</p>
        <p className="member-bio">{bio}</p>
      </div>
      <div className="member-social">
        {githubUrl && (
          <a href={githubUrl} className="social-link">
            <FaGithub />
            <span className="sr-only">GitHub</span>
          </a>
        )}
        {twitterUrl && (
          <a href={twitterUrl} className="social-link">
            <FaTwitter />
            <span className="sr-only">Twitter</span>
          </a>
        )}
        {emailAddress && (
          <a href={`mailto:${emailAddress}`} className="social-link">
            <FaEnvelope />
            <span className="sr-only">Email</span>
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectLandingPage

