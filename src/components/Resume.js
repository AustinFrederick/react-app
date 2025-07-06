import React, {useRef, useEffect, useState} from "react";
const width = 800;
const height = 750;
export const DIMENSIONS = { width: width, height: height };

export default function Resume({ x, y, moveMode, onMove, className }) {
    const dragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const velocityRef = useRef({ x: 0, y: 0 });
    const [spawned, setSpawned] = useState(false);
    useEffect(() => { setSpawned(true) }, []);

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
                transform: spawned ? "scale(1)" : "scale(0.5)",
                opacity: spawned ? 1 : 0,
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

            {/* PROFESSIONAL SUMMARY */}
            <section style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.4rem" }}>
                    Professional Summary
                </h3>
                <p style={{ color: "#444", lineHeight: 1.6 }}>
                    I launched my technical journey as an <strong>IT Intern</strong>, helping
                    set up hardware and maintain the company's intranet. Building on that
                    foundation, I advanced into full-stack debugging for modern codebases
                    and optimizing application reliability.
                </p>
                <p style={{ color: "#444", lineHeight: 1.6 }}>
                    Elevated to <strong>Web Applications Developer</strong>, I manage an app
                    used by almost everyone in the company, creating small applets,
                    designing automated workflows, and optimizing business processes. I’ve
                    architected and deployed Power Apps and automated flows, and helped
                    debug other critical applications.
                </p>
            </section>

            {/* TECHNICAL SKILLS */}
            <section style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.4rem" }}>
                    Technical Skills
                </h3>
                <ul style={{ paddingLeft: "1.2rem" }}>
                    <li>Languages: JavaScript, Java, SQL, Python, C++, C#</li>
                    <li>Frameworks: React, Spring Boot, jQuery</li>
                    <li>Tools: Git, Azure, Postman</li>
                    <li>Databases: SQL</li>
                </ul>
            </section>

            {/* SELECTED PROJECTS */}
            <section style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.4rem" }}>
                    Selected Projects
                </h3>
                <ul style={{ paddingLeft: "1.2rem" }}>
                    <li>
                        <strong>Chalkboard:</strong> A project management app where users
                        forecast upcoming work and managers see team workloads at a glance.
                        Features include timelines with events, phase overlays, and
                        geospatial project mapping.
                    </li>
                    <li>
                        <strong>PlanView:</strong> A large-scale medical equipment planning
                        application. I contributed feature development, debugging,
                        performance tuning, and integration with backend services.
                    </li>
                    <li>
                        <strong>Power Platform Solutions:</strong> Designed and deployed
                        Power Apps and Power Automate flows that streamlined data entry,
                        approvals, and reporting, cutting manual tasks by 70%.
                    </li>
                </ul>
            </section>

            {/* EDUCATION */}
            <section style={{ marginBottom: "1.5rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.4rem" }}>
                    Education
                </h3>
                <p style={{ margin: "0.25rem 0", color: "#444" }}>
                    <strong>University of Kansas</strong>
                </p>
            </section>
        </div>
    );
}
