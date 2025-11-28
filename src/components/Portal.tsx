import { createPortal } from "react-dom";
import React from "react";

export default function Portal({ children }: { children: React.ReactNode }) {
  if (typeof window === "undefined") return null;

  const mount = document.getElementById("portal-root");
  if (!mount) return null;

  return createPortal(children, mount);
}
