import RentItem from "@/features/rents/components/RentItem";
import { rentService } from "@/services/rentService";
import { fetchSettings } from "@/services/settingService";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, View } from "react-native";
export interface Setting {
  id: string;
  electric_rate: number;
  room_rate: number;
}

export interface Rent {
  id: string;
  month: string;
  last_reading: number;
  current_reading: number;
  usage: number;
  electricity_total: number;
  total: number;
  status: string;
  year: string;
  createdAt: string;
  updatedAt: string;
  payment_proof:string
}

const HomeScreen = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [rents, setRents] = useState<Rent[]>([]);
  const router = useRouter();
  const { forceCreate } = useLocalSearchParams() as {
    forceCreate?: string;
  };

  useEffect(() => {
    const fetchData = async () => {
      const settingsResult = (await fetchSettings()) as Setting[];
      setSettings(settingsResult);
    };
    fetchData();
  }, []);

  // Fetch the whole rents objects
  const fetchRents = async () => {
    const rents = (await rentService.fetchRents()) as Rent[];
    const sortedRents = rents.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setRents(sortedRents);
  };

  const createRent = useCallback(
    async (forceCreate: any) => {
      try {
        const today = new Date();

        // Only proceed if it's the 10th day of the month
        if (today.getDate() !== 10) {
          return;
        }

        // Get next month's details
        const nextMonthDate = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          1
        );
        const monthName = new Intl.DateTimeFormat("en-US", {
          month: "long",
        }).format(nextMonthDate);
        const yearName = nextMonthDate.getFullYear().toString();

        // Check if we already have an entry for next month
        const alreadyExists = rents.some(
          (r) => r.month === monthName && r.year === yearName
        );

        if (alreadyExists) {
          return;
        }

        // Get the most recent rent entry for last reading
        const lastRent = rents.length > 0 ? rents[0] : undefined;
        const lastReading = lastRent ? lastRent.current_reading : 0;

        const newRent: Rent = {
          id: Date.now().toString(),
          month: monthName,
          year: yearName,
          last_reading: lastReading,
          current_reading: lastReading,
          usage: 0,
          electricity_total: 0,
          total: 0,
          status: "Pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          payment_proof: ""
        };
        try {
          if (typeof rentService.createRent === "function") {
            await rentService.createRent(newRent);
            const rents = (await rentService.fetchRents()) as Rent[];
            const sortedRents = rents.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            setRents(sortedRents);
          }
        } catch (error) {
          console.error("Failed to create rent document:", error);
        }
      } catch (e) {
        console.error("Error generating pending rent:", e);
      }
    },
    [rents]
  );

  useEffect(() => {
    fetchRents();
  }, []);

  useEffect(() => {
    createRent(forceCreate);
  }, [forceCreate, createRent]);

  const renderItem = ({ item }: { item: Rent }) => {
    const setting = settings && settings.length > 0 ? settings[0] : undefined;
    const handleClickRent = (id: string) => {
      router.push(`/rent/${id}`);
    };

    return (
      <RentItem
        item={item}
        setting={setting}
        onPress={() => {
          handleClickRent(item.id);
        }}
      />
    );
  };

  return (
    <View className="py-2 px-4 ">
      <View>
        <FlatList
          data={rents}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default HomeScreen;
