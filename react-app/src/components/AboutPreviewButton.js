import React from "react";

const style = {
    background: "white",
    color: "#333",
    padding: "1rem",
    borderRadius: "8px",
    cursor: "grab",
    width: "200px",
    border: "2px solid #0d6efd",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    userSelect: "none",
};

const headerStyle = {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#0d6efd",
};

const grayLine = {
    height: "10px",
    backgroundColor: "#ccc",
    borderRadius: "4px",
    margin: "0.3rem 0",
};

export default function AboutPreviewButton() {
    const handleDragStart = (e) => {
        e.dataTransfer.setData("componentType", "About");
    };

    return (
        <div
            style={style}
            draggable
            onDragStart={handleDragStart}
            aria-label="Drag to spawn About component"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") e.preventDefault(); // no action on keyboard drag
            }}
        >
            <div style={headerStyle}>About</div>
            <div style={{ ...grayLine, width: "80%" }}></div>
            <div style={{ ...grayLine, width: "60%" }}></div>
            <div style={{ ...grayLine, width: "70%" }}></div>
        </div>
    );
}
