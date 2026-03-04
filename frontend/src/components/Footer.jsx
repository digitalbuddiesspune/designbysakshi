import React from "react";

const Footer = () => {
  return (
    <footer style={{ background: "#f8f8f8", padding: "1rem 2rem", textAlign: "center", boxShadow: "0 -2px 4px rgba(0,0,0,0.05)", marginTop: "auto" }}>
      <p style={{ margin: 0, color: "#888" }}>&copy; {new Date().getFullYear()} DesignBySakshi. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
