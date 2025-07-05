import React, { useState, useRef  } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Projects from "./Projects";
import Resume from "./components/Resume";
import About from "./components/About";

export default function App() {
    const [spawnedAbouts, setSpawnedAbouts] = useState([]);
    const idCardRef = useRef(null);
    const resumeRef = useRef(null);

    const COMPONENT_WIDTH = 500;
    const COMPONENT_HEIGHT = 300;

    const getExistingRects = () => {
        const rects = [];

        if (idCardRef.current) {
            rects.push(idCardRef.current.getBoundingClientRect());
        }

        if (resumeRef.current) {
            rects.push(resumeRef.current.getBoundingClientRect());
        }

        document.querySelectorAll(".spawned-about").forEach((el) => {
            rects.push(el.getBoundingClientRect());
        });

        return rects;
    };
    const findNonOverlappingPosition = () => {
        const rects = getExistingRects();
        const maxAttempts = 100;

        for (let i = 0; i < maxAttempts; i++) {
            const x = Math.floor(Math.random() * (window.innerWidth - COMPONENT_WIDTH - 40)) + 20;
            const y = Math.floor(Math.random() * (window.innerHeight - COMPONENT_HEIGHT - 40)) + 20;

            if (!isOverlapping(x, y, rects)) {
                return { x, y };
            }
        }

        // Fallback: center of screen
        return {
            x: (window.innerWidth - COMPONENT_WIDTH) / 2,
            y: (window.innerHeight - COMPONENT_HEIGHT) / 2
        };
    };

    const isOverlapping = (x, y, rects) => {
        const newRect = {
            left: x,
            right: x + COMPONENT_WIDTH,
            top: y,
            bottom: y + COMPONENT_HEIGHT,
        };

        return rects.some(r =>
            !(r.right < newRect.left || r.left > newRect.right || r.bottom < newRect.top || r.top > newRect.bottom)
        );
    };
    const spawnAbout = () => {
        if (spawnedAbouts.length > 0) return;

        const { x, y } = findNonOverlappingPosition();
        setSpawnedAbouts([{ id: Date.now(), x, y }]);
    };


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
                    <a onClick={spawnAbout} style={navLinkStyle} role="button">
                        About
                    </a>
                    <Link to="/resume" style={{ ...navLinkStyle, border: "1px solid white", padding: "0.5rem 1rem", borderRadius: "4px" }}>
                        Resume
                    </Link>
                </nav>

                <main style={{ flexGrow: 1, position: "relative" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/resume" element={<Resume />} />
                        {/* Removed "/about" route */}
                    </Routes>

                    {/* Dynamically spawned About components */}
                    {spawnedAbouts.map(({ id, x, y }) => (
                        <About key={id} x={x} y={y} />
                    ))}
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
    cursor: "pointer",
};
