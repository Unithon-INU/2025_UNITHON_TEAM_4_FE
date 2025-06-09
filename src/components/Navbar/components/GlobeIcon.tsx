import React from "react";

type GlobeIconProps = {
  className?: string;
};

export default function GlobeIcon({ className }: GlobeIconProps) {
  return (
    <svg className={className} fill="none" stroke="#ff651b" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="#ff651b" strokeWidth="2" fill="none" />
      <path
        d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20"
        stroke="#ff651b"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
