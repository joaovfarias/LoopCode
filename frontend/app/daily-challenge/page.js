"use client";
import { Typography } from "@mui/material";
import React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DailyChallengePage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const [dailyChallenge, setDailyChallenge] = useState(null);

  const getDailyChallenge = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    try {
      const response = await fetch(`${baseUrl}/daily-challenge`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDailyChallenge();
      if (data) {
        setDailyChallenge(data);
      } else {
        router.replace("/not-found");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (dailyChallenge && dailyChallenge.id) {
      router.replace(`/exercises/${dailyChallenge.id}`);
    }
  }, [dailyChallenge, router]);

  return null;
}
