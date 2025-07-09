// src/components/BlackHole.js
import React, { useRef, useEffect, useState } from "react";
import { GiHole } from "react-icons/gi";

export const DIMENSIONS = { width: 100, height: 100 };

export default function BlackHole({ x, y, onMove, onRelease }) {
    const [spawned, setSpawned] = useState(false);
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const lastPos = useRef({ x: 0, y: 0 });

    useEffect(() => {
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
            const newX = e.clientX - dragOffset.current.x;
            const newY = e.clientY - dragOffset.current.y;
            onMove(newX, newY);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseUp = (e) => {
            if (dragging.current) {
                // compute final drop position
                const dropX = e.clientX - dragOffset.current.x;
                const dropY = e.clientY - dragOffset.current.y;
                onRelease && onRelease(dropX, dropY);
            }
            dragging.current = false;
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [x, y, onMove, onRelease]);

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
                transform: spawned ? "scale(1) rotate(180deg)" : "scale(0.5) rotate(180deg)",
                opacity: spawned ? 1 : 0,
                transition: "transform 300ms ease, opacity 300ms ease",
                zIndex: 100,
                cursor: "grab",
                userSelect: "none",
            }}
        >
            <GiHole style={{ width: "80%", height: "80%" }} />
        </div>
    );
}
