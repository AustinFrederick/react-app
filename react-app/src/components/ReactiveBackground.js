// src/components/ReactiveBackground.js
import React, { useState, useEffect } from "react";

export default function ReactiveBackground({ children }) {
    const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            setCoords({ x, y });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const backgroundStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        background: `radial-gradient(circle at ${coords.x * 100}% ${coords.y * 100}%, #1e1e1e, #121212)`,
        transition: "background 0.2s ease",
    };

    const wrapperStyle = {
        position: "relative",
        width: "100%",
        height: "calc(100vh - 122.8px)",       // full viewport height
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",    // stack children vertically
    };




    return (
        <div style={wrapperStyle}>
            <div style={backgroundStyle} />
            {children}
        </div>
    );
}
