"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import React from "react";

function defaultTransformer(segment: string): string {
  // Handle dynamic route segments that use [param] syntax
  if (segment.startsWith("[") && segment.endsWith("]")) {
    return segment.slice(1, -1); // Remove the brackets
  }

  // Convert kebab-case or snake_case to Title Case with spaces
  return segment
    .replace(/[-_]/g, " ") // Replace hyphens and underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

interface BreadcrumbNavProps {
  homeLabel?: string;
  className?: string;
  transformer?: (segment: string) => string;
}
export function BreadcrumbNav({
  homeLabel = "Home",
  className,
  transformer = defaultTransformer,
}: BreadcrumbNavProps) {
  const pathname = usePathname();
  if (pathname === "/") {
    return null;
  }

  const segments = pathname.split("/").filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    const isLastItem = index === segments.length - 1;

    return { href, label: transformer(segment), isLastItem };
  });

  return (
    <Breadcrumb className={cn("hidden sm:block", className)}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">{homeLabel}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />

        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {crumb.isLastItem ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {!crumb.isLastItem && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
