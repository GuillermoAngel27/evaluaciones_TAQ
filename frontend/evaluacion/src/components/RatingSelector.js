import React from 'react';

export default function RatingSelector({ value, onChange, max = 5, type = "smiley" }) {
  const icons = {
    smiley: ["😡", "😕", "😐", "😊", "😍"]
  };

  return (
    <div style={{ fontSize: "2rem" }}>
      {[...Array(max)].map((_, i) => (
        <span
          key={i}
          style={{
            cursor: "pointer",
            filter: value - 1 === i ? "none" : "grayscale(80%) opacity(0.5)",
            margin: "0 2px"
          }}
          onClick={() => onChange(i + 1)}
        >
          {icons.smiley[i] || icons.smiley[icons.smiley.length - 1]}
        </span>
      ))}
    </div>
  );
}