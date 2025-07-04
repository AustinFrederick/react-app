import React, { useState } from "react";
import myPhoto from "./20220730_171112_cr.jpg";
import FlippingPhrase from "./FlippingPhrase";

export default function IdCard() {
    const [flipped, setFlipped] = useState(false);

    const phrases = [
        "Developer",
        "Programmer",
        "Full-stack Developer",
        "Problem Solver",
        "UI Enthusiast",
    ];


    const cardStyle = {
        perspective: "1000px",
        width: 300,
        height: 420,
        margin: "0 auto",
        cursor: "pointer",
    };

    const cardInnerStyle = {
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 20,
        boxShadow: "0 8px 16px rgba(0,0,0,0.3)",
        transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
    };



    const cardFaceStyle = {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: 20,
        backfaceVisibility: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "1rem",
        boxSizing: "border-box",
        background: "white",
        justifyContent: "center",   // centers items vertically
    };

    const frontFaceStyle = {
        ...cardFaceStyle,
    };

    const backFaceStyle = {
        ...cardFaceStyle,
        background: "#222",
        color: "white",
        transform: "rotateY(180deg)",
        justifyContent: "center",
    };

    return (
        <div
            style={cardStyle}
            onMouseEnter={() => setFlipped(true)}
            onMouseLeave={() => setFlipped(false)}
            tabIndex={0}
            onFocus={() => setFlipped(true)}
            onBlur={() => setFlipped(false)}
            aria-label="ID Card with contact info on flip side"
            role="button"
        >
            <div style={cardInnerStyle}>
                <div style={frontFaceStyle}>
                    <img
                        src={myPhoto}
                        alt="Austin Frederick"
                        style={{
                            borderRadius: "50%",
                            width: 140,
                            height: 140,
                            objectFit: "cover",
                            marginBottom: "1rem",
                            top: "-35px",
                            position: "relative"
                        }}
                    />
                    <h2 style={{ margin: 0 }}>Austin Frederick</h2>
                    <FlippingPhrase phrases={phrases} interval={4200} />
                </div>
                <div style={backFaceStyle}>
                    <div>
                        <p style={{ margin: "0.25rem 0" }}>
                            <strong>Email:</strong> Work@AustinFrederick.com
                        </p>
                        <p style={{ margin: "0.25rem 0" }}>
                            <strong>Phone:</strong> (xxx) xxx xxxx
                        </p>
                        <p style={{ margin: "0.25rem 0" }}>
                            <strong>Location:</strong> Denver, Colorado
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
