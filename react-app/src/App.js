import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Projects from "./Projects";
import Resume from "./components/Resume";
import About from "./components/About";
import IdCard from "./IdCard";

export default function App() {
    const [spawnedAbouts, setSpawnedAbouts] = useState([]);
    const [spawnedResumes, setSpawnedResumes] = useState([]);
    const [moveMode, setMoveMode] = useState(false);

    const COMPONENT_WIDTH = 600;
    const COMPONENT_HEIGHT = 400;

    const getExistingRects = () => {
        const rects = [];
        document.querySelectorAll(".spawned-about, .spawned-resume").forEach((el) => {
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
        return rects.some(
            (r) =>
                !(
                    r.right < newRect.left ||
                    r.left > newRect.right ||
                    r.bottom < newRect.top ||
                    r.top > newRect.bottom
                )
        );
    };

    const getSpawnBounds = () => {
        const header = document.querySelector("nav");
        const footer = document.querySelector("footer");
        const headerRect = header ? header.getBoundingClientRect() : { bottom: 0 };
        const footerRect = footer ? footer.getBoundingClientRect() : { top: window.innerHeight };

        const padding = 20;
        const minX = padding;
        const maxX = window.innerWidth - COMPONENT_WIDTH - padding;
        const minY = headerRect.bottom + padding;
        const maxY = footerRect.top - COMPONENT_HEIGHT - padding;

        return { minX, maxX, minY, maxY };
    };

    const findNonOverlappingPosition = () => {
        const rects = getExistingRects();
        const { minX, maxX, minY, maxY } = getSpawnBounds();

        for (let i = 0; i < 100; i++) {
            const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
            const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;
            if (!isOverlapping(x, y, rects)) {
                return { x, y };
            }
        }
        return {
            x: (minX + maxX) / 2,
            y: (minY + maxY) / 2,
        };
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

    const handleReset = () => {
        setSpawnedAbouts([]);
        setSpawnedResumes([]);
        setMoveMode(false);
    };

    const handleSet = () => {
        setMoveMode(false);
        setSpawnedAbouts([]);
        setSpawnedResumes([]);
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
                    <a onClick={spawnAbout} style={navLinkStyle} role="button">
                        About
                    </a>
                    <a
                        onClick={spawnResume}
                        style={{
                            ...navLinkStyle,
                            border: "1px solid white",
                            padding: "0.5rem 1rem",
                            borderRadius: "4px",
                        }}
                        role="button"
                    >
                        Resume
                    </a>
                </nav>

                <main style={{ flexGrow: 1, position: "relative" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/resume" element={<Resume />} />
                    </Routes>

                    <IdCard
                        moveMode={moveMode}
                        setMoveMode={setMoveMode}
                        onReset={handleReset}
                        onSet={handleSet}
                    />

                    {spawnedAbouts.map(({ id, x, y }) => (
                        <About key={id} x={x} y={y} className="spawned-about" moveMode={moveMode} />
                    ))}
                    {spawnedResumes.map(({ id, x, y }) => (
                        <Resume key={id} x={x} y={y} className="spawned-resume" moveMode={moveMode} />
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
