import React, { useState, useRef, useEffect } from "react";
import myPhoto from "./20220730_171112_cr.jpg";
import FlippingPhrase from "./FlippingPhrase";
import { FaCog, FaArrowsAlt, FaCheck, FaUndo } from "react-icons/fa";

export default function IdCard() {
    const [flipped, setFlipped] = useState(false);
    const [moveMode, setMoveMode] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });

    const dragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const momentumRef = useRef(null);
    const cardRef = useRef(null);

    const phrases = [
        "Developer",
        "Programmer",
        "Full-stack Developer",
        "Problem Solver",
        "UI Enthusiast",
    ];

    const cardWidth = 300;
    const cardHeight = 420;

    const cardStyle = {
        perspective: "1000px",
        width: cardWidth,
        height: cardHeight,
        margin: "0 auto",
        cursor: moveMode ? "grab" : "pointer",
        position: "absolute",
        left: position.x - cardWidth / 2,
        top: position.y - cardHeight / 2,
        border: moveMode ? "2px solid #0d6efd" : "none",
        borderRadius: 20,
        zIndex: 10,
        transition: moveMode ? "none" : "transform 0.3s ease",
    };

    const cardInnerStyle = {
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 20,
        boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
        transition: "transform 0.8s",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    };

    const cardFaceStyle = {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: 20,
        backfaceVisibility: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        boxSizing: "border-box",
        background: "white",
        justifyContent: "center",
    };

    const backFaceStyle = {
        ...cardFaceStyle,
        background: "#222",
        color: "#fff",
        transform: "rotateY(180deg)",
        justifyContent: "flex-start",
    };

    const handleMouseDown = (e) => {
        if (!moveMode) return;
        dragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!dragging.current) return;
        const deltaX = e.clientX - lastPos.current.x;
        const deltaY = e.clientY - lastPos.current.y;
        const newX = position.x + deltaX;
        const newY = position.y + deltaY;
        const bounded = getBoundedPosition(newX, newY, cardWidth, cardHeight);
        setPosition(bounded);
        setVelocity({ x: e.movementX, y: e.movementY });
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        if (!dragging.current) return;
        dragging.current = false;
        startMomentum();
    };

    const startMomentum = () => {
        let vx = velocity.x;
        let vy = velocity.y;

        const animate = () => {
            vx *= 0.95;
            vy *= 0.95;
            if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) return;

            setPosition((prev) => {
                const newX = prev.x + vx;
                const newY = prev.y + vy;
                return getBoundedPosition(newX, newY, cardWidth, cardHeight);
            });

            momentumRef.current = requestAnimationFrame(animate);
        };

        cancelAnimationFrame(momentumRef.current);
        momentumRef.current = requestAnimationFrame(animate);
    };

    const getBoundedPosition = (x, y, width, height) => {
        const xPadding = 20;
        const yPosPadding = 65;
        const yNegPadding = 145;
        const minX = width / 2 + xPadding;
        const maxX = window.innerWidth - width / 2 - xPadding;
        const minY = height / 2 + yPosPadding;
        const maxY = window.innerHeight - height / 2 - yNegPadding ;
        return {
            x: Math.min(Math.max(x, minX), maxX),
            y: Math.min(Math.max(y, minY), maxY),
        };
    };

    const handleReset = () => {
        setMoveMode(false);
        setPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        setFlipped(false);
    };

    const handleSet = () => {
        setMoveMode(false);
        setFlipped(false);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [moveMode, position]);

    return (
        <>
            {moveMode && (
                <div
                    style={{
                        position: "absolute",
                        top: position.y - cardHeight / 2 - 50,
                        left: position.x + cardWidth / 2 - 90,
                        display: "flex",
                        gap: "0.5rem",
                        zIndex: 20,
                    }}
                >
                    <button onClick={handleSet} style={buttonStyle}><FaCheck /></button>
                    <button onClick={handleReset} style={buttonStyle}><FaUndo /></button>
                </div>
            )}
            <div
                ref={cardRef}
                style={cardStyle}
                onMouseDown={handleMouseDown}
                onMouseEnter={() => !moveMode && setFlipped(true)}
                onMouseLeave={() => !moveMode && setFlipped(false)}
                tabIndex={0}
                onFocus={() => !moveMode && setFlipped(true)}
                onBlur={() => !moveMode && setFlipped(false)}
                aria-label="ID Card with contact info on flip side"
            >
                <div style={cardInnerStyle}>
                    <div style={cardFaceStyle}>
                        <img
                            src={myPhoto}
                            alt="Austin Frederick"
                            style={{
                                borderRadius: "50%",
                                width: 140,
                                height: 140,
                                objectFit: "cover",
                                marginBottom: "1rem",
                                top: "-35px",
                                position: "relative",
                            }}
                        />
                        <h2 style={{ margin: 0 }}>Austin Frederick</h2>
                        <FlippingPhrase phrases={phrases} interval={3000} />
                    </div>
                    <div style={backFaceStyle}>
                        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                            <button onClick={() => setMoveMode((m) => !m)} style={buttonStyle} ><FaArrowsAlt /></button>
                            <button style={buttonStyle}><FaCog /></button>
                        </div>
                        <div style={{top:"100px", position:"relative"}}>
                            <p style={{ margin: "0.25rem 0", color: "#ccc" }}>
                                <strong>Email:</strong> Freddy@AustinFrederick.com
                            </p>
                            <p style={{ margin: "0.25rem 0", color: "#ccc" }}>
                                <strong>Phone:</strong> (xxx) xxx xxxx
                            </p>
                            <p style={{ margin: "0.25rem 0", color: "#ccc" }}>
                                <strong>Location:</strong> Denver, Colorado
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const buttonStyle = {
    padding: "0.5rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#555",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "110"
};
