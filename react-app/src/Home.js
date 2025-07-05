// src/Home.js
import React from "react";
import IdCard from "./IdCard";
import ReactiveBackground from "./components/ReactiveBackground";

export default function Home() {
    return (
        <ReactiveBackground>
            <div
                style={{
                    flexGrow: 1,
                    maxWidth: 900,
                    margin: "0 auto",
                    padding: "2rem 1rem 0 1rem",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <IdCard/>
            </div>
        </ReactiveBackground>

    );
}
