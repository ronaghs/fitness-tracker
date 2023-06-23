import React, { useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";

function InfoStack({ imageSrc, altText, title, subtitle1, subtitle2 }) {
  const infoImageRef = useRef(null);
  const infoTextRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
      });
    });

    const infoImage = infoImageRef.current;
    const infoText = infoTextRef.current;
    observer.observe(infoImage);
    observer.observe(infoText);

    // Clean up the observer when the component unmounts
    return () => {
      observer.unobserve(infoImage);
      observer.unobserve(infoText);
    };
  }, []);

  return (
    <div className="infoContainer">
      <div className="infoTextLeft fade-in-left" ref={infoTextRef}>
        <Typography id="infoTitle" variant="h3">
          {title}
        </Typography>
        <Typography variant="h6">{subtitle1}</Typography>
        <Typography variant="h6">{subtitle2}</Typography>
      </div>
      <img
        ref={infoImageRef}
        className="infoImage fade-in-left"
        src={imageSrc}
        alt={altText}
      />
    </div>
  );
}

export default InfoStack;
