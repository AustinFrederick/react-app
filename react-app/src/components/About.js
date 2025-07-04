import React, { useRef, useEffect, useState } from "react";

export default function About({ x, y, moveMode, onMove, className }) {
    const dragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const momentumRef = useRef(null);

    const width = 500;
    const height = 300;

    const frictionX = 0.8;
    const frictionY = 0.75;

    const getBoundedPosition = (x, y) => {
        const padding = 20;
        const headerHeight = document.querySelector("nav")?.getBoundingClientRect().bottom || 0;
        const footerTop = document.querySelector("footer")?.getBoundingClientRect().top || window.innerHeight;
        const minX = padding;
        const maxX = window.innerWidth - width - padding;
        const minY = headerHeight + padding;
        const maxY = footerTop - height - padding;
        return {
            x: Math.min(Math.max(x, minX), maxX),
            y: Math.min(Math.max(y, minY), maxY),
        };
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
        const newPos = getBoundedPosition(x + deltaX, y + deltaY);
        onMove(newPos.x, newPos.y);
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
        if (vx === 0 && vy === 0) return;

        const animate = () => {
            vx *= frictionX;
            vy *= frictionY;
            if (Math.abs(vx) < 0.5 && Math.abs(vy) < 0.5) return;

            const newPos = getBoundedPosition(x + vx, y + vy);
            onMove(newPos.x, newPos.y);

            momentumRef.current = requestAnimationFrame(animate);
        };

        cancelAnimationFrame(momentumRef.current);
        momentumRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
            cancelAnimationFrame(momentumRef.current);
        };
    }, [moveMode, x, y, velocity]);

    return (
        <div
            className={className}
            onMouseDown={handleMouseDown}
            style={{
                position: "absolute",
                top: y,
                left: x,
                width: 900,
                height: 500,
                overflowY: "auto",
                backgroundColor: "white",
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                padding: "1.5rem",
                boxSizing: "border-box",
                color: "#333",
                userSelect: moveMode ? "none" : "text",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                zIndex: 15,
                border: moveMode ? "2px solid #0d6efd" : "none",
                cursor: moveMode ? "grab" : "default",
                transition: "transform 300ms ease, opacity 300ms ease",
                transform: "scale(1)",
                opacity: 1,
            }}
        >
            <h2
                style={{
                    fontSize: "1.8rem",
                    marginTop: 0,
                    borderBottom: "2px solid #0d6efd",
                    paddingBottom: "0.25rem",
                }}
            >
                About Me
            </h2>
            <section style={{ marginBottom: "1rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.3rem" }}>Professional Career</h3>
                <p style={{ color: "#444" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vel neque non
                    libero suscipit suscipit. Vestibulum ante ipsum primis in faucibus orci luctus et
                    ultrices posuere cubilia curae.
                </p>
                <p style={{ color: "#444" }}>
                    Integer sit amet eros efficitur, faucibus metus sed, bibendum tortor.
                </p>
            </section>
            <section>
                <h3 style={{ color: "#0d6efd", fontSize: "1.3rem" }}>Hobbies</h3>
                <p style={{ color: "#444" }}>Sed ut perspiciatis unde omnis iste natus error sit voluptatem.</p>
                <div
                    style={{
                        marginTop: "1rem",
                        height: 120,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#999",
                        fontSize: "1.1rem",
                        fontStyle: "italic",
                    }}
                >
                    Your Image Here
                </div>
            </section>
        </div>
    );
}
