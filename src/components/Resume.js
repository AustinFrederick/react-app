import React, { useRef, useEffect, useState } from "react";

export default function Resume({ x, y, moveMode, onMove, className }) {
    const dragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const momentumRef = useRef(null);

    const width = 800;
    const height = 800;

    // Slower friction for more "weight"
    const frictionX = 0.7;
    const frictionY = 0.65;

    const getBoundedPosition = (x, y) => {
        const padding = 20;
        const headerHeight = document.querySelector("nav")?.getBoundingClientRect().bottom || 0;
        const footerTop = document.querySelector("footer")?.getBoundingClientRect().top || window.innerHeight;
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
                width: width,
                height: height,
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
                <h3 style={{ color: "#0d6efd", fontSize: "1.4rem" }}>Professional Summary</h3>
                <p>
                    Highly skilled and dedicated Full Stack Developer with 6+ years of experience in designing,
                    developing, and maintaining scalable web applications. Proficient in JavaScript, Java,
                    React, Spring Boot, and REST APIs. Adept at problem-solving and team collaboration in fast-paced environments.
                </p>
            </section>

            <section style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.4rem" }}>Technical Skills</h3>
                <ul style={{ paddingLeft: "1.2rem" }}>
                    <li>Languages: JavaScript, Java, SQL, Python, C++, C#</li>
                    <li>Frameworks: React, Spring Boot, jQuery</li>
                    <li>Tools: Git, Azure, Postman</li>
                    <li>Databases: SQL</li>
                </ul>
            </section>

            <section style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.4rem" }}>Work Experience</h3>

                <h4 style={{ margin: "0.5rem 0 0.25rem" }}>Web Applications Developer – Introba</h4>
                <p style={{ margin: 0, fontStyle: "italic", color: "#666" }}>Aug 2019 – Present</p>
                <ul style={{ paddingLeft: "1.2rem" }}>
                    <li>Fusce nec turpis vel odio blandit gravida. Nullam at fermentum velit.</li>
                    <li>Praesent vitae lectus pretium, ornare elit vitae, vulputate orci.</li>
                    <li>Integer ac nulla dapibus, pretium urna in, tincidunt libero.</li>
                </ul>
            </section>

            <section style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.4rem" }}>Education</h3>
                <p>University of Kansas</p>
            </section>
        </div>
    );
}
