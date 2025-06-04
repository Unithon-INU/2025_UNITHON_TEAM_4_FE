// src/pages/Festival/components/popover.tsx
"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";

export function Popover({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const [isOpen, setIsOpen] = useState(open ?? false);

  useEffect(() => {
    if (typeof open === "boolean") setIsOpen(open);
  }, [open]);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen]);

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative">{children}</div> {/* 위치 기준 요소 */}
    </PopoverContext.Provider>
  );
}

const PopoverContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

function usePopover() {
  const context = React.useContext(PopoverContext);
  if (!context) throw new Error("Popover components must be used inside <Popover>");
  return context;
}

export function PopoverTrigger({
  children,
}: {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>;
}) {
  const { setIsOpen } = usePopover();

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      children.props.onClick?.(e);
      setIsOpen((prev) => !prev);
    },
  });
}

export function PopoverContent({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}) {
  const { isOpen, setIsOpen } = usePopover();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={`absolute right-0 top-full z-20 mt-2 w-80 rounded-md border bg-white p-4 shadow-lg ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
