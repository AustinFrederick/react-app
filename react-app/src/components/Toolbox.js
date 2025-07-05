// src/components/Toolbox.js
import React from "react";
import { GiLockedChest } from "react-icons/gi";

export default function Toolbox({ open, onToggle, children }) {
    return (
        <div style={toolboxStyle}>
            <button onClick={onToggle} style={toolboxButtonStyle}>
            </button>
            {open && <div style={popupMenuStyle}>{children}</div>}
        </div>
    );
}

const toolboxStyle = {
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 30,
};

const toolboxButtonStyle = {
    background: "none",
    border: "none",
    color: "white",
    cursor: "pointer",
};

const popupMenuStyle = {
    marginTop: 10,
    backgroundColor: "white",
    color: "#555",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
    position: "relative",
    top: "-20px"
};
