import { Rent, Setting } from "@/app/(drawer)/rent";
import { rentService } from "@/services/rentService";
import { fetchSettings } from "@/services/settingService";
import { useEffect, useState } from "react";

interface ElectricityStats {
  usage: number;
  totalCost: number;
}

export function useRentDetail(
  id: string | string[] | undefined,
  currentReading: string
) {
  const [rent, setRent] = useState<Rent | null>(null);
  const [setting, setSetting] = useState<Setting | null>(null);
  const [electricityStats, setElectricityStats] = useState<ElectricityStats>({
    usage: 0,
    totalCost: 0,
  });
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const rentId = Array.isArray(id) ? id[0] : id;
      const rent = (await rentService.fetchRent(rentId)) as Rent;
      setRent(rent);
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const settingsResult = (await fetchSettings()) as Setting[];
      setSetting(
        settingsResult && settingsResult.length > 0 ? settingsResult[0] : null
      );
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (rent?.status === "Pending") {
      setElectricityStats({
        usage: rent?.usage,
        totalCost: rent?.electricity_total,
      });
    } else if (rent?.status === "Paid") {
      setElectricityStats({
        usage: rent?.usage,
        totalCost: rent?.electricity_total,
      });
      setImageUri(rent?.payment_proof || null);
    } else if (rent && currentReading.trim() !== "") {
      const lastReading = rent.last_reading || 0;
      const current = parseFloat(currentReading) || 0;
      const usage = current - lastReading;
      const totalCost = setting ? usage * setting.electric_rate : 0;
      setElectricityStats({ usage, totalCost });
    } else {
      setElectricityStats({ usage: 0, totalCost: 0 });
    }
  }, [rent, currentReading, setting]);

  return {
    rent,
    setting,
    electricityStats,
    setRent,
    setSetting,
    imageUri,
    setImageUri,
  };
}
