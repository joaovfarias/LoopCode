"use client";
import { useEffect, useRef } from "react";

export default function Warmup() {
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    fetch(process.env.NEXT_PUBLIC_API_URL + "/health/ping", {
      method: "GET",
      cache: "no-store",
    })
      .then(() => {
        console.log("ping");
      })
      .catch(() => {
        // Ignore errors — backend may still be booting
      });
  }, []);

  return null;
}
