import React, {useRef, useEffect, useState} from "react";
const width = 650;
const height = 750;
export const DIMENSIONS = { width: width, height: height };

export default function About({ x, y, moveMode, onMove, className }) {
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
        const maxX = window.innerWidth - width - padding;
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

    const handleMouseUp = () => {
        if (!dragging.current) return;
        dragging.current = false;
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!dragging.current) return;
            const deltaX = e.clientX - lastPos.current.x;
            const deltaY = e.clientY - lastPos.current.y;
            const newPos = getBoundedPosition(x + deltaX, y + deltaY);
            velocityRef.current = { x: e.movementX, y: e.movementY };
            onMove(newPos.x, newPos.y, velocityRef.current.x, velocityRef.current.y);
            lastPos.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [moveMode, x, y, onMove]);

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
                    fontSize: "1.8rem",
                    marginTop: 0,
                    borderBottom: "2px solid #0d6efd",
                    paddingBottom: "0.25rem",
                }}
            >
                About Me
            </h2>
            <section style={{ marginBottom: "1.5rem", padding: "0 1rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                    Professional Career
                </h3>
                <p style={{ color: "#444", marginBottom: "0.75rem", lineHeight: 1.6 }}>
                    I launched my technical journey as an <strong>IT Intern</strong>, helping set up hardware and maintain the company's intranet.
                    Building on that foundation, I advanced into full-stack debugging for modern codebases and optimizing application reliability.
                </p>
                <p style={{ color: "#444", lineHeight: 1.6 }}>
                    Elevated to <strong>Web Applications Developer</strong>, I spearhead the development of enterprise-grade intranet portals and bespoke internal tools that empower project managers and teams to track tasks and time estimates with precision.
                    I’ve architected and deployed Power Apps and automated flows, and leveraged technologies including Spring Boot, C#, BASIC, C++, Python, Microsoft Power Automate, and Azure to deliver scalable, resilient solutions that drive operational efficiency.
                </p>
            </section>

            <section>
                <h3 style={{color: "#0d6efd", fontSize: "1.3rem", marginBottom: "0.5rem"}}>
                    Hobbies
                </h3>
                <p style={{color: "#444", lineHeight: 1.6}}>
                    When I’m not behind my keyboard, you’ll find me chasing Colorado sunsets—hiking
                    its rugged mountain trails or kayaking along its lakes and twisting rivers. I’m equally
                    drawn to analog pursuits, capturing moments on film and hunting down the next
                    gem for my vinyl collection, all while tinkering on and restoring classic
                    arcade cabinets in my basement. Evenings often find me immersed in the latest
                    video game or vibing at a live concert, and when travel calls, I’m first in line
                    for a new adventure. Naturally, I’m also a fan of the Denver Nuggets
                    and Avs.
                </p>
                {/*<div
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
                    <img
                        src={myPhoto}
                        alt="red rocks"
                        style={{
                            borderRadius: "5%",
                            width: 532,
                            height: 120,
                            objectFit: "cover",
                            position: "relative",
                            justifyContent: "center"
                        }}
                    />
                </div>*/}
            </section>
        </div>
    );
}
