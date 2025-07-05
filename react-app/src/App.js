import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import Projects from "./Projects";
import Resume from "./components/Resume";
import About from "./components/About";

export default function App() {
    const [spawnedAbouts, setSpawnedAbouts] = useState([]);
    const [spawnedResumes, setSpawnedResumes] = useState([]);

    const idCardRef = useRef(null);
    const resumeRef = useRef(null);

    const COMPONENT_WIDTH = 600;
    const COMPONENT_HEIGHT = 400;

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

        document.querySelectorAll(".spawned-resume").forEach((el) => {
            rects.push(el.getBoundingClientRect());
        });

        return rects;
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

    const getBoundedPosition = (x, y, width, height) => {
        const xPadding = 20;
        const yPosPadding = 65;
        const yNegPadding = 145;
        const minX = width / 2 + xPadding;
        const maxX = window.innerWidth - width / 2 - xPadding;
        const minY = height / 2 + yPosPadding;
        const maxY = window.innerHeight - height / 2 - yNegPadding;
        return {
            x: Math.min(Math.max(x, minX), maxX),
            y: Math.min(Math.max(y, minY), maxY),
        };
    };

    const findNonOverlappingPosition = () => {
        const rects = getExistingRects();
        const maxAttempts = 100;

        for (let i = 0; i < maxAttempts; i++) {
            const x = Math.floor(Math.random() * (window.innerWidth - COMPONENT_WIDTH - 40)) + 20;
            const y = Math.floor(Math.random() * (window.innerHeight - COMPONENT_HEIGHT - 40)) + 20;

            if (!isOverlapping(x, y, rects)) {
                return getBoundedPosition(x, y, COMPONENT_WIDTH, COMPONENT_HEIGHT);
            }
        }

        return getBoundedPosition(
            (window.innerWidth - COMPONENT_WIDTH) / 2,
            (window.innerHeight - COMPONENT_HEIGHT) / 2,
            COMPONENT_WIDTH,
            COMPONENT_HEIGHT
        );
    };

    const spawnAbout = () => {
        if (spawnedAbouts.length > 0) return;

        const { x, y } = findNonOverlappingPosition();
        setSpawnedAbouts([{ id: Date.now(), x, y }]);
    };

    const spawnResume = () => {
        if (spawnedResumes.length > 0) return;

        const { x, y } = findNonOverlappingPosition();
        setSpawnedResumes([{ id: Date.now(), x, y }]);
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
                  {/*  <Link to="/" style={navLinkStyle}>
                        Home
                    </Link>*/}
                    <a onClick={spawnAbout} style={navLinkStyle} role="button">
                        About
                    </a>
                    <a onClick={spawnResume} style={{ ...navLinkStyle, border: "1px solid white", padding: "0.5rem 1rem", borderRadius: "4px" }} role="button">
                        Resume
                    </a>
                </nav>

                <main style={{ flexGrow: 1, position: "relative" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/resume" element={<Resume />} />
                    </Routes>

                    {spawnedAbouts.map(({ id, x, y }) => (
                        <About key={id} x={x} y={y} className="spawned-about" />
                    ))}

                    {spawnedResumes.map(({ id, x, y }) => (
                        <Resume key={id} x={x} y={y} className="spawned-resume" />
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
