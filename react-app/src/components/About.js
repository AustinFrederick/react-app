import React, { useEffect, useState } from "react";

export default function About({ x = 100, y = 100 }) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    return (
        <div
            style={{
                position: "absolute",
                top: y,
                left: x,
                transform: visible ? "scale(1)" : "scale(0.5)",
                opacity: visible ? 1 : 0,
                transition: "transform 300ms ease, opacity 300ms ease",
                width: 500,
                backgroundColor: "white",
                borderRadius: 16,
                boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
                padding: "1.5rem",
                boxSizing: "border-box",
                color: "#333",
                userSelect: "text",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                zIndex: 15,
            }}
        >
            <h2 style={{ fontSize: "1.8rem", marginTop: 0, borderBottom: "2px solid #0d6efd", paddingBottom: "0.25rem" }}>
                About Me
            </h2>
            <section style={{ marginBottom: "1rem" }}>
                <h3 style={{ color: "#0d6efd", fontSize: "1.3rem" }}>Professional Career</h3>
                <p style={{ color: "#444" }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                    vel neque non libero suscipit suscipit. Vestibulum ante ipsum primis in
                    faucibus orci luctus et ultrices posuere cubilia curae.
                </p>
                <p style={{ color: "#444" }}>
                    Integer sit amet eros efficitur, faucibus metus sed, bibendum tortor.
                </p>
            </section>
            <section>
                <h3 style={{ color: "#0d6efd", fontSize: "1.3rem" }}>Hobbies</h3>
                <p style={{ color: "#444" }}>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
                </p>
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
