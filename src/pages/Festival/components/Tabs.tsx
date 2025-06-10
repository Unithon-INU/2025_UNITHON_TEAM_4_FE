import * as React from "react";

// Context 생성 (제네릭 사용)
type TabsContextType = {
  value: string;
  onValueChange: (value: string) => void;
};
const TabsContext = React.createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return <div className="mb-4 flex gap-2 border-b pb-2">{children}</div>;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");
  const { value: selected, onValueChange } = ctx;
  const isActive = selected === value;
  return (
    <button
      onClick={() => onValueChange(value)}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        isActive ? "border-b-2 border-rose-500 text-rose-500" : "text-gray-500 hover:text-rose-500"
      }`}
    >
      {children}
    </button>
  );
}
