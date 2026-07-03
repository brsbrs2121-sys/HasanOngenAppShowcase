"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function BodyClassHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    // Remove previously applied body classes
    document.body.classList.remove("login-page");

    // Prevent page scrolling on the login page
    if (pathname === "/login") {
      document.body.classList.add("login-page");
    }

    // No additional body classes are required for iOS.
    // Safe area spacing is handled using CSS variables and the safe-top utility.

  }, [pathname]);

  return null;
}
