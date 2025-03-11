"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const themes = [
    { value: "system", icon: Monitor },
    { value: "light", icon: Sun },
    { value: "dark", icon: Moon },
  ];

  return (
    <div className="flex h-8 w-full items-center justify-between gap-2 px-2 py-1.5">
      <span className="text-sm font-normal text-foreground leading-[16px]">
        Theme
      </span>
      <MotionConfig transition={{ type: "spring", bounce: 0.1, duration: 0.2 }}>
        <ToggleGroup
          type="single"
          value={theme}
          onValueChange={(value) => {
            if (value) setTheme(value);
          }}
          className="bg-muted rounded-full p-0.5 relative flex gap-0 [&>*]:flex-1 h-6 w-auto"
        >
          {themes.map((t) => (
            <ToggleGroupItem
              key={t.value}
              value={t.value}
              className={cn(
                "relative z-10 rounded-full aspect-square p-0",
                "data-[state=on]:bg-transparent",
                "focus-visible:outline-1 focus-visible:ring-1 focus-visible:outline-none",
                "transition-colors",
                "[&:not([data-state=on])]:hover:bg-background/20",
                "flex items-center justify-center h-5 w-5"
              )}
            >
              {theme === t.value && (
                <motion.span
                  layoutId="themeIndicator"
                  className="absolute inset-0 z-10 bg-background mix-blend-difference rounded-full shadow-inner"
                  transition={{ type: "spring", bounce: 0.1, duration: 0.2 }}
                />
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={t.value}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="relative z-20"
                >
                  <t.icon
                    className="h-[12px] w-[12px] p-[2px]"
                    strokeWidth={1.5}
                    width={16}
                    height={16}
                  />
                </motion.div>
              </AnimatePresence>
              <span className="sr-only">{t.value} theme</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </MotionConfig>
    </div>
  );
}
