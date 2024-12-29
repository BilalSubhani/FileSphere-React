import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <p>&copy; 2024 FileSphere. All rights reserved.</p>
        <p>
          Contact us:{" "}
          <a href="mailto:support@filesphere.com">support@filesphere.com</a>
        </p>
        <p>Phone: +92 (123) 456-7890</p>
      </div>
    </footer>
  );
};

export default Footer;
