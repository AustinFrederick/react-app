import React from "react";
import { GiLockedChest } from "react-icons/gi";

export default function Toolbox({ open, onToggle, children, style }) {
    return (
        <div style={{ ...toolboxStyle, ...style }}>
            <button onClick={onToggle} style={toolboxButtonStyle} aria-label="Toggle Toolbox"></button>
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
    width: 40,
    height: 40,
};

const popupMenuStyle = {
    marginTop: 10,
    backgroundColor: "white",
    color: "#555",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
    position: "relative",
    top: "-20px",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
};
