// src/components/BlackHole.js
import React, { useRef, useEffect, useState } from "react";
import {GiHole} from "react-icons/gi";

export const DIMENSIONS = { width: 100, height: 100 };

export default function BlackHole({ x, y, onMove }) {
    const [spawned, setSpawned] = useState(false);
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // simple “pop” animation on mount
        requestAnimationFrame(() => setSpawned(true));
    }, []);

    const handleMouseDown = (e) => {
        dragging.current = true;
        dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
        lastPos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!dragging.current) return;
            const rawX = e.clientX - dragOffset.current.x;
            const rawY = e.clientY - dragOffset.current.y;
            /*const vx = e.clientX - lastPos.current.x;
            const vy = e.clientY - lastPos.current.y;*/
            onMove(rawX, rawY);            // only position matters
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
    }, [x, y, onMove]);

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: 40,            // make it square
                height: 40,
                display: "flex",       // center the icon
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,          // control icon size
                borderRadius: "50%",   // still keep circular hit area
                background: "radial-gradient(circle at 50% 50%, #000, #111)",
                boxShadow: "0 0 60px 20px rgba(0,0,0,0.2)",
                pointerEvents: "auto",
                transform: spawned
                    ? "scale(1)"
                    : "scale(0.5)",
                opacity: spawned ? 1 : 0,
                transition: "transform 300ms ease, opacity 300ms ease",
                zIndex: 100,
                cursor: "grab",
                userSelect: "none",
                color:"#1e1e1e"
            }}
        >
            <GiHole style={{width: "80%", height: "80%"}}/>
        </div>

    );
}
