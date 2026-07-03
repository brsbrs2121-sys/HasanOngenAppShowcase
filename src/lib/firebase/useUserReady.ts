"use client";

import { useEffect } from "react";
import { useUser } from "./index";

export function useUserReady(callback: (user: any) => void) {
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      callback(user);
    }
  }, [isLoading, user, callback]);
}
