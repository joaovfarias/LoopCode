"use client";
import { useEffect } from "react";

export default function Warmup() {
  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_URL + "/health/ping", {
      method: "GET",
      cache: "no-store",
    }).catch(() => {
      // Ignore errors — backend may still be booting
    });
  }, []);

  console.log("Warmup ping sent to backend");

  return null;
}
