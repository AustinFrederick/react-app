// src/components/Ball.js
import React, { useRef, useEffect } from 'react';

// Circular ball dimensions
export const DIMENSIONS = { width: 45, height: 45 };

export default function Ball({ x, y, moveMode, onMove, className }) {
    const dragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        if (!moveMode) return;
        dragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
    };

    useEffect(() => {
        if (!moveMode) return;
        const handleMouseMove = (e) => {
            if (!dragging.current) return;
            const dx = e.clientX - lastPos.current.x;
            const dy = e.clientY - lastPos.current.y;
            onMove(x + dx, y + dy, dx, dy);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };
        const handleMouseUp = () => {
            dragging.current = false;
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [moveMode, x, y, onMove]);

// Generate a random shade of grey or a blue hue (based on #0d6efd) once
    const color = React.useMemo(() => {
        // 30% of the time pick grey, 70% pick a blue variant
        if (Math.random() < 0.3) {
            // greys between 70% and 90% lightness
            const lightness = Math.floor(Math.random() * 20 + 70);
            return `hsl(0, 0%, ${lightness}%)`;
        } else {
            // blue around hue 216 (the H of #0d6efd), sat from 60–100%, lightness 40–60%
            const hue = 216;
            const saturation = Math.floor(Math.random() * 40 + 60);
            const lightness = Math.floor(Math.random() * 20 + 40);
            return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
    }, []);


    const style = {
        position: 'absolute',
        left: x,
        top: y,
        width: DIMENSIONS.width,
        height: DIMENSIONS.height,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%, ${color}, #000)`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        cursor: moveMode ? 'grab' : 'pointer',
        zIndex: 15,
        userSelect: 'none',
    };

    return <div className={className} style={style} onMouseDown={handleMouseDown} />;
}
