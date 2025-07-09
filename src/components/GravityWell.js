import React, { useRef, useEffect, useState } from "react";
import { GiJupiter } from "react-icons/gi";

export const DIMENSIONS = { width: 100, height: 100 };

export default function GravityWell({ x, y, onMove }) {
    const [spawned, setSpawned] = useState(false);
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // “pop” animation
        requestAnimationFrame(() => setSpawned(true));
    }, []);

    const handleMouseDown = (e) => {
        dragging.current = true;
        dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
        lastPos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };

    useEffect(() => {
        const onMouseMove = (e) => {
            if (!dragging.current) return;
            const rawX = e.clientX - dragOffset.current.x;
            const rawY = e.clientY - dragOffset.current.y;
            onMove(rawX, rawY);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };
        const onMouseUp = () => {
            dragging.current = false;
        };
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
        };
    }, [x, y, onMove]);

    return (
        <div
            onMouseDown={handleMouseDown}
            style={{
                position: "absolute",
                left: x,
                top: y,
                width: DIMENSIONS.width,
                height: DIMENSIONS.height,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 80,
                borderRadius: "50%",
                pointerEvents: "auto",
                transform: spawned ? "scale(1)" : "scale(0.5)",
                opacity: spawned ? 1 : 0,
                transition: "transform 300ms ease, opacity 300ms ease",
                zIndex: 100,
                cursor: "grab",
                userSelect: "none",
                color: "rgb(210, 165, 80)",
                background: "radial-gradient(circle at 50% 50%, #000, #111)",
            }}
        >
            <GiJupiter style={{ width: "80%", height: "80%" }} />
        </div>
    );
}
