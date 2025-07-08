// src/App.js
import React, {useState, useEffect, useCallback, useRef} from "react";
import $ from "jquery";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./Home";
import Projects from "./Projects";
import Resume, {DIMENSIONS as RESUME_DIMENSIONS} from "./components/Resume";
import About, {DIMENSIONS as ABOUT_DIMENSIONS} from "./components/About";
import IdCard, {DIMENSIONS as ID_DIMENSIONS} from "./components/IdCard";
import Ball, {DIMENSIONS as BALL_DIMENSIONS} from "./components/Ball";
import { isMobile } from 'react-device-detect';
import PhysicsEngine from "./physics";
import {PiSpinnerBallDuotone} from "react-icons/pi";

// Nav link styling
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
    // ±3px/frame initial velocity
    const randomVelocity = () => Math.random() * 30 - 3;

    // Initialize physics and spawn centered IdCard using its own dim
    useEffect(() => {
        const engine = new PhysicsEngine({friction: 0.995, restitution: 0.7});
        engineRef.current = engine;

        const {width: w0, height: h0} = ID_DIMENSIONS;
        const startX = window.innerWidth / 2 - w0 / 2;
        const startY = window.innerHeight / 2 - h0 / 2;

        engine.addBody(
            "idCard",
            startX,
            startY,
            0,  // start static
            0,
            w0,
            h0,
            9999999
        );

        setBodiesList([
            {id: "idCard", type: "idCard", width: w0, height: h0},
        ]);

        let raf;
        const loop = () => {
            // compute bottom‐boundary at the top of footer
            const footerEl = document.querySelector('footer');
            const screenH = footerEl
                ? footerEl.getBoundingClientRect().top
                : window.innerHeight;
            engine.step(window.innerWidth, screenH - 71);
            setBodiesList((list) => [...list]);
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, []);

    // Update physics on manual drag
    const handleDrag = useCallback((id, x, y, vx, vy) => {
        const b = engineRef.current.bodies.get(id);
        engineRef.current.addBody(id, x, y, vx, vy, b.width, b.height);
    }, []);

    // Spawn About card with its own dim
    const spawnAbout = () => {
        if (bodiesList.some((b) => b.type === "about")) return;
        const headerH = $("nav").outerHeight(true) || 0;
        const {width: w1, height: h1} = ABOUT_DIMENSIONS;
        const x1 = 50;
        const y1 = headerH + 20;

        engineRef.current.addBody(
            "about",
            x1,
            y1,
            randomVelocity(),
            randomVelocity(),
            w1,
            h1
        );
        setBodiesList((l) => [...l, {id: "about", type: "about", width: w1, height: h1}]);
    };

    // Spawn Resume card with its own dim.
    const spawnResume = () => {
        if (bodiesList.some((b) => b.type === "resume")) return;
        const headerH = $("nav").outerHeight(true) || 0;
        const {width: w2, height: h2} = RESUME_DIMENSIONS;
        const x2 = window.innerWidth - w2 - 50;
        const y2 = headerH + 20;

        engineRef.current.addBody(
            "resume",
            x2,
            y2,
            randomVelocity(),
            randomVelocity(),
            w2,
            h2
        );
        setBodiesList((l) => [...l, {id: "resume", type: "resume", width: w2, height: h2}]);
    };


    const spawnBall = () => {
        const existing = bodiesList.filter(b => b.type === "ball").length;
        const spaceLeft = allowedBalls - existing;    // how many more we can add
        if (spaceLeft <= 0) return;

        const headerH = $("nav").outerHeight(true) || 0;
        const { width: w3, height: h3 } = BALL_DIMENSIONS;

        for (let i = 0; i < spaceLeft; i++) {
            // stagger each spawn by 200ms
            const timer = setTimeout(() => {
                const id = `ball-${Date.now()}-${i}`;
                const x3 = Math.random() * (window.innerWidth - w3 - 40) + 20;
                const y3 = headerH + (window.innerHeight) + Math.random() * 100;

                // add to physics
                engineRef.current.addBody(
                    id,
                    x3,
                    y3,
                    randomVelocity(),
                    randomVelocity(),
                    w3,
                    h3,
                    0.01
                );

                // reflect in React state
                setBodiesList((prev) => [
                    ...prev,
                    { id, type: "ball", width: w3, height: h3 },
                ]);
            }, i * 200);
            spawnTimers.current.push(timer);
        }
    };


    // Clear and stop move mode
    const handleReset = useCallback(() => {
        engineRef.current.bodies.clear();
        spawnTimers.current.forEach(clearTimeout);
        spawnTimers.current = [];
        const { width, height } = ID_DIMENSIONS;
        const centerX = window.innerWidth/2 - width/2;
        const centerY = window.innerHeight/2 - height/2;
        engineRef.current.addBody("idCard", centerX, centerY, 0, 0, width, height);
        setBodiesList([{ id: "idCard", type: "idCard", width, height }]);
        setMoveMode(false);
        setResetCounter(c => c + 1);
    }, []);

    const handleSet = () => setMoveMode(false);

    // Reset on window resize
    useEffect(() => {
        const onResize = () => handleReset();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [handleReset]);

    return (
        <Router>
            <div style={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
                <nav style={{
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
                }}>
                   {/* <button type="button" onClick={spawnAbout} style={{
                        ...navLinkStyle, background: "transparent", border: "none", padding: 0
                    }}>
                        About
                    </button>

                    <button type="button" onClick={spawnResume} style={{
                        ...navLinkStyle,
                        background: "transparent",
                        border: "1px solid white",
                        padding: "0.5rem 1rem",
                        borderRadius: "4px",
                    }}>
                        Resume
                    </button>*/}

                    {/* only show Ball spawner when moveMode is true */}
                    {moveMode && (
                        <button
                            type="button"
                            onClick={spawnBall}
                            disabled={bodiesList.filter(b => b.type === "ball").length >= 1 } //accepts allowedBalls instead of "1", but with how the balls spawn right now the user could technically spawn more than allowedBalls soo...
                            style={{
                                ...navLinkStyle,
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                fontSize: "32px",
                                display: moveMode ? "flex" : "none",
                                opacity: bodiesList.filter(b => b.type === "ball").length < 1 ? 1 : 0.3,//accepts allowedBalls instead of "1"
                                cursor: bodiesList.filter(b => b.type === "ball").length < 1 ? "pointer" : "not-allowed",//accepts allowedBalls instead of "1"
                            }}
                        >
                            <PiSpinnerBallDuotone />
                        </button>
                    )}
                </nav>

                <main style={{flexGrow: 1, position: "relative", userSelect: "none"}}>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/projects" element={<Projects/>}/>
                        <Route path="/resume" element={<Resume/>}/>
                    </Routes>

                    {bodiesList.map(({id, type, width, height}) => {
                        const body = engineRef.current.bodies.get(id);
                        if (!body) return null;
                        const common = {
                            x: body.x,
                            y: body.y,
                            moveMode,
                            onMove: (nx, ny, vx, vy) => handleDrag(id, nx, ny, vx, vy),
                        };

                        if (type === "idCard") {
                            return (
                                <IdCard
                                    key={id + `-${resetCounter}`}
                                    {...common}
                                    width={width}
                                    height={height}
                                    setMoveMode={setMoveMode}
                                    onReset={handleReset}
                                    onSet={handleSet}
                                    spawnAbout={spawnAbout}
                                    spawnResume={spawnResume}
                                />
                            );
                        }
                        if (type === "about") return <About key={id} {...common} width={width} height={height}/>;
                        if (type === "resume") return <Resume key={id} {...common} width={width} height={height}/>;
                        if (type === "ball") return <Ball key={id} {...common} className="spawned-ball" />;
                        return null;
                    })}
                </main>

                <footer style={{
                    textAlign: "center",
                    padding: "1rem",
                    background: "#222",
                    color: "white",
                    fontSize: "0.9rem"
                }}>
                    &copy; {new Date().getFullYear()} Austin Frederick
                </footer>
            </div>
        </Router>
    );
}
