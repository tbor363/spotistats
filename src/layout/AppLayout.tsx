// navbar + container + footer
import { NavLink } from "react-router-dom";

import "../css/AppLayout.css";

function AppLayout({ children }: { children: React.ReactNode }) {
  const navItems = [
    "Overview",
    "Top Tracks",
    "Top Artists",
    "Top Genres",
    "Recently Played",
  ];
  const navLinks = [
    "/overview",
    "/top-tracks",
    "/top-artists",
    "/top-genres",
    "/recently-played",
  ];

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">SPOTISTATS</div>
          <div className="navbar-links">
            {navItems.map((item, index) => (
              <NavLink
                key={item}
                to={navLinks[index]}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "active" : ""}`
                }
                end // ensures exact match for e.g. "/overview"
              >
                {item}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="main">{children}</main>
    </>
  );
}
export default AppLayout;
