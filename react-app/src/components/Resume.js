import React, { useEffect, useState, useRef } from "react";

export default function Resume({ x = 100, y = 100, moveMode = false, onMove, border, className }) {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x, y });
    const dragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    // Sync external x, y props
    useEffect(() => {
        setPosition({ x, y });
    }, [x, y]);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    // Stop dragging if moveMode is disabled
    useEffect(() => {
        if (!moveMode) dragging.current = false;
    }, [moveMode]);

    // Bounding position inside viewport (header/footer and sides)
    const getBoundedPosition = (x, y, width = 900, height = 700) => {
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
        let newX = position.x + deltaX;
        let newY = position.y + deltaY;

        const bounded = getBoundedPosition(newX, newY);
        newX = bounded.x;
        newY = bounded.y;

        setPosition({ x: newX, y: newY });
        if (onMove) onMove(newX, newY);
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
        dragging.current = false;
    };

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [moveMode, position]);

    return (
        <div
            className={className}
            onMouseDown={handleMouseDown}
            style={{
                position: "absolute",
                top: position.y,
                left: position.x,
                transform: visible ? "scale(1)" : "scale(0.5)",
                opacity: visible ? 1 : 0,
                transition: "transform 300ms ease, opacity 300ms ease",
                width: 900,
                height: 700,
                overflowY: "auto",
                backgroundColor: "white",
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                padding: "1.5rem",
                boxSizing: "border-box",
                color: "#333",
                userSelect: moveMode ? "none" : "text",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                zIndex: 15,border: moveMode ? "2px solid #0d6efd" : "none",
                cursor: moveMode ? "grab" : "default",
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
