// src/components/Ball.js
import React, { useRef, useEffect, useState } from "react";

// Circular ball dimensions
export const DIMENSIONS = { width: 45, height: 45 };

export default function Ball({ x, y, moveMode, onMove, className }) {
    const [spawned, setSpawned] = useState(false);
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const lastPos = useRef({ x: 0, y: 0 });

    // trigger spawn animation on mount
    useEffect(() => {
        requestAnimationFrame(() => setSpawned(true));
    }, []);

    // start drag, capture grab‐point
    const handleMouseDown = (e) => {
        if (!moveMode) return;
        dragging.current = true;
        dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
        lastPos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };

    // drag & drop
    useEffect(() => {
        if (!moveMode) return;
        const handleMouseMove = (e) => {
            if (!dragging.current) return;
            const rawX = e.clientX - dragOffset.current.x;
            const rawY = e.clientY - dragOffset.current.y;
            const vx = e.clientX - lastPos.current.x;
            const vy = e.clientY - lastPos.current.y;
            onMove(rawX, rawY, vx, vy);
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
    }, [moveMode, x, y, onMove]);

    // random grey/blue color
    const color = React.useMemo(() => {
        const hue = 216;
        const s = Math.floor(Math.random() * 40 + 60);
        const l = Math.floor(Math.random() * 20 + 40);
        return `hsl(${hue},${s}%,${l}%)`;
       /* if (Math.random() < 0.3) {
            const l = Math.floor(Math.random() * 20 + 70);
            return `hsl(0,0%,${l}%)`;
        } else {
            const hue = 216;
            const s = Math.floor(Math.random() * 40 + 60);
            const l = Math.floor(Math.random() * 20 + 40);
            return `hsl(${hue},${s}%,${l}%)`;
        }*/
    }, []);

    const style = {
        position: "absolute",
        left: x,
        top: y,
        width: DIMENSIONS.width,
        height: DIMENSIONS.height,
        borderRadius: "50%",
        background: `radial-gradient(circle at 30% 30%, ${color}, #000)`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        cursor: moveMode ? "grab" : "default",
        zIndex: 15,
        userSelect: "none",
        // spawn animation:
        transform: spawned ? "scale(1)" : "scale(0.5)",
        opacity: spawned ? 1 : 0,
        transition: "transform 300ms ease, opacity 300ms ease",
    };

    return (
        <div
            className={className}
            style={style}
            onMouseDown={handleMouseDown}
        />
    );
}
