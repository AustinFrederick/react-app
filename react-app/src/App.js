import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import About from "./About";
import Projects from "./Projects";
import Resume from "./Resume";

export default function App() {
    return (
        <Router>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                <nav
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        padding: "1rem 2rem",
                        gap: "1rem",
                        background: "#222",
                        color: "white",
                        alignItems: "center",
                        position: "sticky",
                        top: 0,
                        zIndex: 100,
                    }}
                >
                    <Link to="/" style={navLinkStyle}>
                        Home
                    </Link>
                    <Link to="/about" style={navLinkStyle}>
                        About
                    </Link>
                   {/* <Link to="/projects" style={navLinkStyle}>
                        Projects
                    </Link>*/}
                    <Link to="/resume" style={{ ...navLinkStyle, border: "1px solid white", padding: "0.5rem 1rem", borderRadius: "4px" }}>
                        Resume
                    </Link>
                </nav>

                <main style={{ flexGrow: 1 }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/resume" element={<Resume />} />
                    </Routes>
                </main>

                <footer
                    style={{
                        textAlign: "center",
                        padding: "1rem",
                        background: "#222",
                        color: "white",
                        fontSize: "0.9rem",
                    }}
                >
                    &copy; {new Date().getFullYear()} Austin Frederick
                </footer>
            </div>
        </Router>
    );
}

const navLinkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "1rem",
};





