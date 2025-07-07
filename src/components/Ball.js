// src/components/Ball.js
import React, { useRef, useEffect } from "react";

// Circular ball dimensions
export const DIMENSIONS = { width: 45, height: 45 };

export default function Ball({ x, y, moveMode, onMove, className }) {
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const lastPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (!moveMode) return;
        dragging.current = true;
        // capture where on the ball the user clicked
        dragOffset.current = { x: e.clientX - x, y: e.clientY - y };
        lastPos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };

    useEffect(() => {
        if (!moveMode) return;
        const handleMouseMove = (e) => {
            if (!dragging.current) return;
            // compute new top-left so the grab point stays under cursor
            const rawX = e.clientX - dragOffset.current.x;
            const rawY = e.clientY - dragOffset.current.y;
            // delta for velocity
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

    // Generate a random shade of grey or a blue hue once
    const color = React.useMemo(() => {
        if (Math.random() < 0.3) {
            const lightness = Math.floor(Math.random() * 20 + 70);
            return `hsl(0, 0%, ${lightness}%)`;
        } else {
            const hue = 216;
            const saturation = Math.floor(Math.random() * 40 + 60);
            const lightness = Math.floor(Math.random() * 20 + 40);
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
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
        cursor: moveMode ? "grab" : "pointer",
        zIndex: 15,
        userSelect: "none",
    };

    return (
        <div
            className={className}
            style={style}
            onMouseDown={handleMouseDown}
        />
    );
}
