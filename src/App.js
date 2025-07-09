// src/App.js
import React, { useState, useEffect, useCallback, useRef } from "react";
import $ from "jquery";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Projects from "./Projects";
import Resume/*, { DIMENSIONS as RESUME_DIMENSIONS }*/ from "./components/Resume";
import About/*, { DIMENSIONS as ABOUT_DIMENSIONS }*/ from "./components/About";
import IdCard, { DIMENSIONS as ID_DIMENSIONS } from "./components/IdCard";
import Ball, { DIMENSIONS as BALL_DIMENSIONS } from "./components/Ball";
import BlackHole, { DIMENSIONS as HOLE_DIMENSIONS } from "./components/BlackHole";
import GravityWell, { DIMENSIONS as WELL_DIMENSIONS } from "./components/GravityWell";
import { isMobile } from "react-device-detect";
import PhysicsEngine from "./physics";
import { GiPartyHat, GiHole, GiJupiter } from "react-icons/gi";

const navLinkStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "1rem",
    cursor: "pointer",
    background: "none",
};

export default function App() {
    const [resetCounter, setResetCounter] = useState(0);
    const [moveMode, setMoveMode] = useState(false);
    const [bodiesList, setBodiesList] = useState([]);
    const engineRef = useRef(null);
    const allowedBalls = 40;
    const spawnTimers = useRef([]);

    const randomVelocity = () => Math.random() * 6 - 3;

    // Black-hole state
    const [holePos, setHolePos] = useState(null);
    const holePosRef = useRef(holePos);
    useEffect(() => {
        holePosRef.current = holePos;
    }, [holePos]);
    const handleHoleMove = useCallback((x, y) => {
        setHolePos({ x, y });
    }, []);
    // when drag ends: if dropped over nav, remove hole
    const handleHoleRelease = useCallback((x, y) => {
        const navH = $("nav").outerHeight(true) || 0;
        if (y < navH) setHolePos(null);
    }, []);

    // Gravity-well state
    const [wellPos, setWellPos] = useState(null);
    const wellPosRef = useRef(wellPos);
    useEffect(() => {
        wellPosRef.current = wellPos;
    }, [wellPos]);
    const handleWellMove = useCallback((x, y) => {
        setWellPos({ x, y });
    }, []);
    // when drag ends: if dropped over nav, remove well
    const handleWellRelease = useCallback((x, y) => {
        const navH = $("nav").outerHeight(true) || 0;
        if (y < navH) setWellPos(null);
    }, []);

    // initialize physics once
    useEffect(() => {
        const engine = new PhysicsEngine({ friction: 0.995, restitution: 0.7 });
        engineRef.current = engine;

        // add the ID card in the center
        const { width: iw, height: ih } = ID_DIMENSIONS;
        engine.addBody(
            "idCard",
            window.innerWidth / 2 - iw / 2,
            window.innerHeight / 2 - ih / 2,
            0,
            0,
            iw,
            ih,
            9999999
        );
        setBodiesList([{ id: "idCard", type: "idCard", width: iw, height: ih }]);

        let raf;
        const loop = () => {
            // 1) pull from black hole (and schedule deletion)
            const hole = holePosRef.current;
            if (hole) {
                engine.bodies.forEach((b, id) => {
                    if (!id.startsWith("ball")) return;
                    const cx = hole.x + HOLE_DIMENSIONS.width / 2;
                    const cy = hole.y + HOLE_DIMENSIONS.height / 2;
                    const dx = cx - (b.x + b.width / 2);
                    const dy = cy - (b.y + b.height / 2);
                    const dist = Math.hypot(dx, dy);
                    if (dist > 0) {
                        const force = 3000 / (dist * dist);
                        b.vx += (dx / dist) * force;
                        b.vy += (dy / dist) * force;
                    }
                });
            }

            // 2) pull from gravity well (no deletion)
            const well = wellPosRef.current;
            if (well) {
                engine.bodies.forEach((b, id) => {
                    if (!id.startsWith("ball")) return;
                    const cx = well.x + WELL_DIMENSIONS.width / 2;
                    const cy = well.y + WELL_DIMENSIONS.height / 2;
                    const dx = cx - (b.x + b.width / 2);
                    const dy = cy - (b.y + b.height / 2);
                    const dist = Math.hypot(dx, dy) + 5;
                    if (dist > 0) {
                        const force = 3000 / (dist * dist);
                        b.vx += (dx / dist) * force;
                        b.vy += (dy / dist) * force;
                    }
                });
            }

            // 3) step physics
            const footer = document.querySelector("footer");
            const screenH = footer
                ? footer.getBoundingClientRect().top
                : window.innerHeight;
            engine.step(window.innerWidth, screenH - 71);

            // 4) remove balls overlapping the black hole
            if (hole) {
                setBodiesList((list) =>
                    list.filter(({ id, type }) => {
                        if (type !== "ball") return true;
                        const b = engine.bodies.get(id);
                        if (!b) return false;
                        const holeRect = {
                            left: hole.x,
                            right: hole.x + HOLE_DIMENSIONS.width,
                            top: hole.y,
                            bottom: hole.y + HOLE_DIMENSIONS.height,
                        };
                        const ballRect = {
                            left: b.x,
                            right: b.x + b.width,
                            top: b.y,
                            bottom: b.y + b.height,
                        };
                        const overlap =
                            ballRect.left < holeRect.right &&
                            ballRect.right > holeRect.left &&
                            ballRect.top < holeRect.bottom &&
                            ballRect.bottom > holeRect.top;
                        if (overlap) {
                            engine.removeBody(id);
                            return false;
                        }
                        return true;
                    })
                );
            }

            // 5) trigger React re-render
            setBodiesList((l) => [...l]);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    // drag handler (idCard, hole, well)
    const handleDrag = useCallback((id, x, y, vx, vy) => {
        const b = engineRef.current.bodies.get(id);
        engineRef.current.addBody(id, x, y, vx, vy, b.width, b.height, b.mass);
    }, []);

    // spawn balls
    const spawnBall = () => {
        const existing = bodiesList.filter((b) => b.type === "ball").length;
        const spaceLeft = allowedBalls - existing;
        if (spaceLeft <= 0) return;

        const navH = $("nav").outerHeight(true) || 0;
        const { width: bw, height: bh } = BALL_DIMENSIONS;
        for (let i = 0; i < spaceLeft; i++) {
            const t = setTimeout(() => {
                const id = `ball-${Date.now()}-${i}`;
                const x = Math.random() * (window.innerWidth - bw - 40) + 20;
                const y = navH + 20 + Math.random() * 100;
                engineRef.current.addBody(
                    id,
                    x,
                    y,
                    randomVelocity(),
                    randomVelocity(),
                    bw,
                    bh,
                    0.01
                );
                setBodiesList((p) => [...p, { id, type: "ball", width: bw, height: bh }]);
            }, i * 150);
            spawnTimers.current.push(t);
        }
    };

    // spawn black hole
    const spawnHole = () => {
        if (holePos) return;
        const navH = $("nav").outerHeight(true) || 0;
        setHolePos({
            x: window.innerWidth - HOLE_DIMENSIONS.width - 20,
            y: navH + 20,
        });
    };

    // spawn gravity well
    const spawnWell = () => {
        if (wellPos) return;
        const navH = $("nav").outerHeight(true) || 0;
        setWellPos({
            x: window.innerWidth - WELL_DIMENSIONS.width - 20,
            y: navH + 20,
        });
    };

    // full reset
    const handleReset = useCallback(() => {
        engineRef.current.bodies.clear();
        spawnTimers.current.forEach(clearTimeout);
        spawnTimers.current = [];
        setHolePos(null);
        setWellPos(null);

        const { width: iw, height: ih } = ID_DIMENSIONS;
        engineRef.current.addBody(
            "idCard",
            window.innerWidth / 2 - iw / 2,
            window.innerHeight / 2 - ih / 2,
            0,
            0,
            iw,
            ih,
            9999999
        );
        setBodiesList([{ id: "idCard", type: "idCard", width: iw, height: ih }]);
        setMoveMode(false);
        setResetCounter((c) => c + 1);
    }, []);

    useEffect(() => {
        window.addEventListener("resize", handleReset);
        return () => window.removeEventListener("resize", handleReset);
    }, [handleReset]);

    return (
        <Router>
            <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
                {holePos && (
                    <BlackHole
                        x={holePos.x}
                        y={holePos.y}
                        onMove={handleHoleMove}
                        onRelease={handleHoleRelease}
                    />
                )}
                {wellPos && (
                    <GravityWell
                        x={wellPos.x}
                        y={wellPos.y}
                        onMove={handleWellMove}
                        onRelease={handleWellRelease}
                    />
                )}

                <nav
                    style={{
                        display: !isMobile ? "flex" : "none",
                        justifyContent: "flex-end",
                        padding: "1rem 2rem",
                        gap: "1rem",
                        background: "#222",
                        color: "white",
                        alignItems: "center",
                        position: "sticky",
                        top: 0,
                        zIndex: 50,
                        height: "71px",
                        userSelect: "none",
                    }}
                >
                    {moveMode && !holePos && (
                        <button
                            onClick={spawnHole}
                            style={{ ...navLinkStyle, fontSize: 32, border: "none", padding: 0 }}
                        >
                            <GiHole />
                        </button>
                    )}
                    {moveMode && !wellPos && (
                        <button
                            onClick={spawnWell}
                            style={{ ...navLinkStyle, fontSize: 32, border: "none", padding: 0 }}
                        >
                            <GiJupiter />
                        </button>
                    )}
                    {moveMode && (
                        <button
                            onClick={spawnBall}
                            disabled={
                                bodiesList.filter((b) => b.type === "ball").length >= allowedBalls
                            }
                            style={{
                                ...navLinkStyle,
                                fontSize: 32,
                                border: "none",
                                padding: 0,
                                opacity:
                                    bodiesList.filter((b) => b.type === "ball").length < allowedBalls
                                        ? 1
                                        : 0,
                                cursor:
                                    bodiesList.filter((b) => b.type === "ball").length < allowedBalls
                                        ? "pointer"
                                        : "default",
                            }}
                        >
                            <GiPartyHat />
                        </button>
                    )}
                </nav>

                <main style={{ flexGrow: 1, position: "relative", userSelect: "none" }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/resume" element={<Resume />} />
                    </Routes>

                    {bodiesList.map(({ id, type, width, height }) => {
                        const b = engineRef.current.bodies.get(id);
                        if (!b) return null;
                        const common = {
                            x: b.x,
                            y: b.y,
                            moveMode,
                            onMove: (x, y, vx, vy) => handleDrag(id, x, y, vx, vy),
                        };
                        switch (type) {
                            case "idCard":
                                return (
                                    <IdCard
                                        key={`${id}-${resetCounter}`}
                                        {...common}
                                        width={width}
                                        height={height}
                                        setMoveMode={setMoveMode}
                                        onReset={handleReset}
                                        onSet={() => setMoveMode(false)}
                                    />
                                );
                            case "about":
                                return <About key={id} {...common} width={width} height={height} />;
                            case "resume":
                                return <Resume key={id} {...common} width={width} height={height} />;
                            case "ball":
                                return <Ball key={id} {...common} className="spawned-ball" />;
                            default:
                                return null;
                        }
                    })}
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
