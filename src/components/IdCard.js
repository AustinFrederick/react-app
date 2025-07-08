// src/components/IdCard.js
import React, { useRef, useState, useEffect } from "react";
import myPhoto from "../20220730_171112_cr.jpg";
import FlippingPhrase from "./FlippingPhrase";
import {  FaArrowsAlt, FaCheck, FaUndo  } from "react-icons/fa";
import {isMobile} from "react-device-detect";
// Card dimensions
const cardWidth = 350;
const cardHeight = 420;
export const DIMENSIONS = { width: cardWidth, height: cardHeight };

export default function IdCard({
                                   x,
                                   y,
                                   moveMode,
                                   onMove,
                                   className,
                                   setMoveMode,
                                   onReset,
                                   onSet,
                                   /*spawnAbout,
                                   spawnResume,*/
                               }) {
    const [flipped, setFlipped] = useState(false);
    const [spawned, setSpawned] = useState(false);
    // const [copiedField, setCopiedField] = useState(null);
    useEffect(() => {
        // trigger the animation on mount
        setSpawned(true);
    }, []);
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const lastPos = useRef({ x: 0, y: 0 });
    // const velocityRef = useRef({ x: 0, y: 0 });



    // Clamp top-left x/y within viewport bounds
    const getBoundedPosition = (nx, ny) => {
        const xPadding = 5;
        const yPosPadding = 5;
        const yNegPadding = 130;
        const minX = xPadding;
        const maxX = window.innerWidth - cardWidth - xPadding;
        const minY = yPosPadding;
        const maxY = window.innerHeight - cardHeight - yNegPadding;
        return {
            x: Math.min(Math.max(nx, minX), maxX),
            y: Math.min(Math.max(ny, minY), maxY),
        };
    };

   /* const handleCopy = (label, value) => {
        navigator.clipboard.writeText(value);
        setCopiedField(label);
        setTimeout(() => setCopiedField(null), 2000);
    };*/
    // Mouse/touch drag handlers
 /*   const handleMouseDown = (e) => {
        if (!moveMode) return;
        dragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };*/

    const handleMouseDown = (e) => {
        if (!moveMode) return;
        dragging.current = true;
        dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
        lastPos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };
    useEffect(() => {
        /*const handleMouseMove = (e) => {
            if (!dragging.current) return;
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            const { x: bx, y: by } = getBoundedPosition(x + dx, y + dy);
            velocityRef.current = { x: e.movementX, y: e.movementY };
            onMove(bx, by, velocityRef.current.x, velocityRef.current.y);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };*/
        const handleMouseMove = (e) => {
            if (!dragging.current) return;
            // keep grab point under cursor:
            const rawX = e.clientX - dragOffset.current.x;
            const rawY = e.clientY - dragOffset.current.y;
            const { x: bx, y: by } = getBoundedPosition(rawX, rawY);
            // compute velocity
            let vx = e.clientX - lastPos.current.x;
            let vy = e.clientY - lastPos.current.y;
            if(Math.abs(e.clientX- lastPos.current.x)<.005 || Math.abs(e.clientY- lastPos.current.y)<.005){
                vx = vy =0;
            }
            onMove(bx, by, vx, vy);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseUp = () => {
            dragging.current = false;
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [moveMode,x,y,onMove]);
    useEffect(() => {
        // whenever moveMode goes false, flip back to front
        if (!moveMode) {
            setFlipped(false);
        }
    }, [moveMode]);
    // Styling for card
    const borderStyle = moveMode ? "2px solid #0d6efd" : "none";
    const cardStyle = {
        position: "absolute",
        left: x,
        top: y,
        width: cardWidth,
        height: cardHeight,
        cursor: moveMode ? "grab" : "default",
        perspective: "1000px",
        border: borderStyle,
        borderRadius: 20,
        zIndex: 90,
        /* animate position as well as transform & opacity */
        transition: moveMode
            ? "none"
            : "left 0.5s ease, top 0.5s ease, transform 0.3s ease, opacity 0.3s ease",
        userSelect: "none",
        transform: spawned ? "scale(1)" : "scale(0.5)",
        opacity: spawned ? 1 : 0,
    };


    const innerStyle = {
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 20,
        boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
        transformStyle: "preserve-3d",
        transition: "transform 0.8s",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        userSelect: moveMode ? "none" : "auto",
    };

    const faceStyle = {
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
        userSelect: moveMode ? "none" : "auto",
    };

    const backFaceStyle = {
        ...faceStyle,
        background: "#222",
        color: "#fff",
        transform: "rotateY(180deg)",
        justifyContent: "flex-start",
        userSelect: moveMode ? "none" : "auto",
    };

    const buttonStyle = {
        padding: "0.5rem",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "white",
        color: "#555",
        fontSize: "1.25rem",
        cursor: "pointer",
        display:  !isMobile ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 90,
        userSelect: moveMode ? "none" : "auto",
    };
    const phrases = React.useMemo(() => [
        "Developer",
        "Problem Solver",
        "Full-stack Developer",
        "Dedicated",
        "Programmer",
    ], []);

    return (
        <>
            {/* Move controls above card when in moveMode */}
            {moveMode && (
                <div
                    style={{
                        position: "absolute",
                        top: y - 50,
                        left: x + cardWidth - 90,
                        display: "flex",
                        gap: "0.5rem",
                        zIndex: 90,
                        userSelect: "none",
                    }}
                >
                    <button onClick={onSet} style={buttonStyle}>
                        <FaCheck />
                    </button>
                    <button onClick={onReset} style={buttonStyle}>
                        <FaUndo />
                    </button>
                </div>
            )}

            {/* ID Card element */}
            <div
                className={className}
                style={cardStyle}
                onMouseDown={handleMouseDown}
                onMouseEnter={() => !moveMode && setFlipped(true)}
                onMouseLeave={() => !moveMode && setFlipped(false)}
                tabIndex={0}
                onFocus={() => !moveMode && setFlipped(true)}
                onBlur={() => !moveMode && setFlipped(false)}
                aria-label="ID Card with contact info"
            >
                <div style={innerStyle}>
                    {/* Front face */}
                    <div style={faceStyle}>
                        <img
                            src={myPhoto}
                            alt="Austin Frederick"
                            style={{
                                borderRadius: "50%",
                                width: 140,
                                height: 140,
                                objectFit: "cover",
                                marginBottom: "1rem",
                                position: "relative",
                                top: -35,
                            }}
                        />
                        <h2 style={{ margin: 0 }}>Austin Frederick</h2>
                        <FlippingPhrase phrases={phrases} interval={3000} />
                    </div>
                    {/* Back face */}
                    <div style={backFaceStyle}>
                        <div style={{
                            display: "flex",
                            gap: "1rem",
                            marginBottom: "1rem",
                            top: "60px",
                            position: "relative"
                        }}>
                            <button onClick={() => setMoveMode(true)} style={buttonStyle} aria-pressed={moveMode}>
                                <FaArrowsAlt/>
                            </button>
                            {/*<button onClick={() => {
                            }} style={buttonStyle}>
                                <FaCog/>
                            </button>*/}
                        </div>
                        <div
                            style={{
                                position: "relative",
                                top: 150,
                                padding: "0 1rem",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                                width: "100%",
                                color: "#ccc",
                                fontSize: "0.95rem",
                                textAlign: "center",
                            }}
                        >
                            <span style={{fontWeight: 400}}>AustinFrederick.com</span>
                            <span style={{fontWeight: 400}}>Denver, Colorado</span>
                        </div>
                        {/* <div
                            style={{
                                position: "relative",
                                top: 100,
                                padding: "0 1rem",
                                display: "none",
                                flexDirection: "column",
                                gap: "0.75rem",
                                width:"100%"
                            }}
                        >
                            {[
                                {label: "Email", value: "Freddy@AustinFrederick.com"},
                                // {label: "Phone", value: "(xxx) xxx xxxx"},
                                {label: "Location", value: "Denver, Colorado"},
                            ].map(({label, value}) => (
                                <div
                                    key={label}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: "0.25rem 0",
                                        color: "#ccc",
                                        fontSize: "0.95rem",
                                    }}
                                >
                                  <span>
                                    <strong style={{marginRight: "0.5rem"}}>{label}:</strong>
                                    <span style={{fontWeight: 400}}>{value}</span>
                                  </span>
                                     Only Email & Phone get a copy icon
                                    {label !== "Location" && (
                                        copiedField === label ? (
                                            <span style={{ fontSize: "0.75rem", color: "#ccc",marginLeft: "10px" }}>Copied!</span>
                                        ) : (
                                            <FaRegCopy
                                                onClick={() => handleCopy(label, value)}
                                                style={{ cursor: "pointer", marginLeft: "10px" }}
                                                title={`Copy ${label.toLowerCase()}`}
                                            />
                                        )
                                    )}
                                </div>
                            ))}
                        </div>*/}
                    </div>
                </div>
            </div>
        </>
    );
}
