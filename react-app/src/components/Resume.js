import React, { useEffect, useState } from "react";

export default function Resume({ x = 100, y = 100 }) {
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
                width: 900,
                height: 700,
                overflowY: "auto",
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

            <section style={{marginBottom: "1.5rem"}}>
                <h3 style={{color: "#0d6efd", fontSize: "1.4rem"}}>Work Experience</h3>

                <h4 style={{margin: "0.5rem 0 0.25rem"}}>Web Applications Developer – Introba</h4>
                <p style={{margin: 0, fontStyle: "italic", color: "#666"}}>Aug 2019 – Present</p>
                <ul style={{paddingLeft: "1.2rem"}}>
                    <li>Fusce nec turpis vel odio blandit gravida. Nullam at fermentum velit.</li>
                    <li>Praesent vitae lectus pretium, ornare elit vitae, vulputate orci.</li>
                    <li>Integer ac nulla dapibus, pretium urna in, tincidunt libero.</li>
                </ul>
            </section>

            <section style={{marginBottom: "1.5rem"}}>
                <h3 style={{color: "#0d6efd", fontSize: "1.4rem"}}>Education</h3>
                <p>
                    University of Kansas
                </p>
            </section>

        </div>
    );
}
