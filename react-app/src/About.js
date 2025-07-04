import React from "react";
import ReactiveBackground from "./components/ReactiveBackground";

export default function About() {
    return (
        <ReactiveBackground>
        <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem", color:"white" }}>
            <h1>About Me</h1>
            <p>This is the about page. Add your biography or any info here.</p>
        </div>
            </ReactiveBackground>
    );
}