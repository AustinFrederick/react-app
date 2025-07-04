import React, { useState, useEffect } from "react";

export default function FlippingPhrase({ phrases, interval = 4200 }) {
    const [index, setIndex] = useState(0);
    const [phase, setPhase] = useState("idle"); // 'idle' | 'exit' | 'enter'
    const [visible, setVisible] = useState(phrases[0]);

    useEffect(() => {
        const loop = setInterval(() => {
            setPhase("exit");
            setTimeout(() => {
                setVisible(phrases[(index + 1) % phrases.length]);
                setIndex((i) => (i + 1) % phrases.length);
                setPhase("enter");
                setTimeout(() => setPhase("idle"), 500); // duration of animation
            }, 500); // exit animation duration
        }, interval);

        return () => clearInterval(loop);
    }, [index, interval, phrases]);

    const containerStyle = {
        fontSize: "1.25rem",
        marginTop: "0.5rem",
        color: "#555",
        height: "1.5em",
        width: "200px",
        perspective: "1000px",
        position: "relative",
        overflow: "hidden",
        display: "inline-block",
        textAlign: "center",
    };

    const phraseStyle = {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
        whiteSpace: "nowrap",
        transformOrigin: "center",
        transition: "transform 0.5s ease-in-out, opacity 0.5s ease-in-out",
        opacity: 1,
        transform: "rotateX(0deg)",
    };

    const animatedStyle = {
        ...phraseStyle,
        ...(phase === "exit" && {
            opacity: 0,
            transform: "rotateX(-90deg)",
        }),
        ...(phase === "enter" && {
            opacity: 1,
            transform: "rotateX(0deg)",
        }),
    };

    return (
        <div style={containerStyle} aria-live="polite" aria-atomic="true">
            <span style={animatedStyle}>{visible}</span>
        </div>
    );
}
