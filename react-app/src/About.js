import React from "react";

export default function About() {
    return (
        <div style={containerStyle} tabIndex={0} aria-label="About section">
            <h2 style={headerStyle}>About Me</h2>
            <div style={contentStyle}>
                <section style={sectionStyle}>
                    <h3 style={subHeaderStyle}>Professional Career</h3>
                    <p style={paragraphStyle}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
                        vel neque non libero suscipit suscipit. Praesent eu dolor nec elit
                        hendrerit tempus. Vestibulum ante ipsum primis in faucibus orci
                        luctus et ultrices posuere cubilia curae; Duis consequat felis nec
                        purus mattis, at luctus nunc pellentesque.
                    </p>
                    <p style={paragraphStyle}>
                        Integer sit amet eros efficitur, faucibus metus sed, bibendum
                        tortor. Pellentesque habitant morbi tristique senectus et netus et
                        malesuada fames ac turpis egestas.
                    </p>
                </section>
                <section style={sectionStyle}>
                    <h3 style={subHeaderStyle}>Hobbies</h3>
                    <p style={paragraphStyle}>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                        quae ab illo inventore veritatis et quasi architecto beatae vitae
                        dicta sunt explicabo.
                    </p>
                    <p style={paragraphStyle}>
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                        fugit, sed quia consequuntur magni dolores eos qui ratione
                        voluptatem sequi nesciunt.
                    </p>
                    <div style={imagePlaceholderStyle} aria-label="Hobby image placeholder">
                        {/* Replace this div with your image or graphic */}
                        <span style={imageTextStyle}>Your Image Here</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

const containerStyle = {
    width: 350,
    minHeight: 250,
    backgroundColor: "white",
    borderRadius: 16,
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    padding: "1.5rem",
    boxSizing: "border-box",
    color: "#333",
    userSelect: "text",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const headerStyle = {
    margin: "0 0 1rem 0",
    fontSize: "1.8rem",
    borderBottom: "2px solid #0d6efd",
    paddingBottom: "0.25rem",
};

const contentStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
};

const sectionStyle = {
    lineHeight: 1.5,
};

const subHeaderStyle = {
    margin: "0 0 0.5rem 0",
    fontSize: "1.3rem",
    color: "#0d6efd",
};

const paragraphStyle = {
    margin: "0 0 0.75rem 0",
    fontSize: "1rem",
    color: "#444",
};

const imagePlaceholderStyle = {
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
};

const imageTextStyle = {
    userSelect: "none",
};
