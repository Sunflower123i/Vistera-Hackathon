"use client";

import { DashboardData } from "./DashboardData"
import DashboardUI from "./DashboardUI"

import { useEffect, useState } from "react";

const sampleData = {
  patientsCount: 10,
  alertsCount: 20,
  agentsCount: 30,
  callsCount: 40,
};

export default function DashboardPage() {
  const [data, setData] = useState<{ patientsCount: number; alertsCount: number; agentsCount: number; callsCount: number } | null>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await DashboardData();
      setData(result);
    }
    fetchData();
  }, []);

  const displayData = data || sampleData;

  return <DashboardUI {...displayData} />;
}

