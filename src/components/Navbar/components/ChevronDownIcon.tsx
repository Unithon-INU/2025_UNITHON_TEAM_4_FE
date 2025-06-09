import React from "react";

type ChevronDownIconProps = {
  className?: string;
};

export default function ChevronDownIcon({ className }: ChevronDownIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M19 9l-7 7-7-7" />
    </svg>
  );
}
