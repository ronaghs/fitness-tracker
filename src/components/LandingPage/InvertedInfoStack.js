import React, { useEffect, useRef } from "react";
import Typography from "@mui/material/Typography";

function InvertedInfoStack({ imageSrc, altText, title, subtitle1, subtitle2 }) {
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
    <div className="invertedInfoContainer">
      <div ref={infoTextRef} className="infoTextRight fade-in-right">
        <Typography id="infoTitle" variant="h3">
          {title}
        </Typography>
        <Typography id="infoSubtitle" variant="h6">
          {subtitle1}
        </Typography>
        <Typography id="infoSubtitle" variant="h6">
          {subtitle2}
        </Typography>
      </div>
      <img
        ref={infoImageRef}
        className="invertedInfoImage fade-in"
        src={imageSrc}
        alt={altText}
      />
    </div>
  );
}

export default InvertedInfoStack;
