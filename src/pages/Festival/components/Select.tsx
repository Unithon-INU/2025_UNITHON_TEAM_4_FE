// src/pages/Festival/components/select.tsx
import * as React from "react";
import { useState, useContext, createContext } from "react";
import { cva } from "class-variance-authority";

const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm   disabled:cursor-not-allowed disabled:opacity-50"
);

interface SelectContextType {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  value: string;
  onValueChange: (value: string) => void;
}

const SelectContext = createContext<SelectContextType | null>(null);

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Select = ({
  value,
  onValueChange,
  className = "",
  children,
}: SelectProps) => {
  const [open, setOpen] = useState(false);
  return (
    <SelectContext.Provider value={{ open, setOpen, value, onValueChange }}>
      <div className={`relative w-full ${className}`}>{children}</div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = "", ...props }, ref) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectTrigger must be used within Select");

  const { setOpen } = context;

  return (
    <button
      ref={ref}
      className={`${selectTriggerVariants()} ${className}`}
      onClick={(e) => {
        props.onClick?.(e);
        setOpen((prev) => !prev);
      }}
      {...props}
    />
  );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectValue = ({ placeholder }: { placeholder?: string }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectValue must be used within Select");
  const { value } = context;
  return (
    <span className="text-sm text-muted-foreground">
      {value ? value : placeholder}
    </span>
  );
};

export const SelectContent = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectContent must be used within Select");
  const { open } = context;

  if (!open) return null;

  return (
    <div className="absolute z-20 mt-1 w-full rounded-md border bg-white shadow-lg">
      <div className="max-h-60 overflow-y-auto p-1 text-sm">{children}</div>
    </div>
  );
};

export const SelectItem = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) => {
  const context = useContext(SelectContext);
  if (!context) throw new Error("SelectItem must be used within Select");
  const { setOpen, onValueChange } = context;

  return (
    <div
      onClick={() => {
        onValueChange(value);
        setOpen(false);
      }}
      className="cursor-pointer rounded-sm px-2 py-1.5 hover:bg-accent hover:text-accent-foreground"
    >
      {children}
    </div>
  );
};
