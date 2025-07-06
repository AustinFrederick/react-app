import React, { useRef, useEffect } from "react";
const width = 800;
const height = 800;
export const DIMENSIONS = { width: width, height: height };

export default function Resume({ x, y, moveMode, onMove, className }) {
    const dragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });


    const getBoundedPosition = (x, y) => {
        const padding = 20;
        const headerHeight =
            document.querySelector("nav")?.getBoundingClientRect().bottom || 0;
        const footerTop =
            document.querySelector("footer")?.getBoundingClientRect().top ||
            window.innerHeight;
        const minX = padding;
        const maxX = window.innerWidth - width - padding + 4;
        const minY = headerHeight - padding - 30;
        const maxY = footerTop - padding - height - 70;
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
        velocityRef.current = { x: e.movementX, y: e.movementY };
        onMove(newPos.x, newPos.y, velocityRef.current.x, velocityRef.current.y);
        lastPos.current = { x: e.clientX, y: e.clientY };
    };
    const handleMouseUp = () => {
        if (!dragging.current) return;
        dragging.current = false;
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [moveMode, x, y]);

    return (
        <div
            className={className}
            onMouseDown={handleMouseDown}
            style={{
                position: "absolute",
                top: y,
                left: x,
                width,
                height,
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
                    fontSize: "2rem",
                    marginTop: 0,
                    borderBottom: "2px solid #0d6efd",
                    paddingBottom: "0.25rem",
                }}
            >
                Resume
            </h2>

            <section style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.4rem" }}>
                    Professional Summary
                </h3>
                <p>
                    Highly skilled and dedicated Full Stack Developer with 6+ years of
                    experience in designing, developing, and maintaining scalable web
                    applications. Proficient in JavaScript, Java, React, Spring Boot, and
                    REST APIs. Adept at problem-solving and team collaboration in
                    fast-paced environments.
                </p>
            </section>

            {/* …the rest of your original Resume content unchanged… */}
        </div>
    );
}
