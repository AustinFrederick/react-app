import React from "react";
import ReactiveBackground from "./components/ReactiveBackground";

export default function Resume() {
    return (
        <ReactiveBackground>
            <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
                <h1>Resume</h1>
                <p>Link or embed your resume here.</p>
            </div>
        </ReactiveBackground>
    );
}