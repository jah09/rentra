import { useRentDetail } from "@/hooks/useRentDetailHook";
import { rentService } from "@/services/rentService";
import * as ImagePicker from "expo-image-picker";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RentDetailScreen: React.FC = () => {
  const [currentReading, setCurrentReading] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useGlobalSearchParams();
  const {
    rent,
    setting,
    electricityStats,
    imageUri,
    setImageUri,
  } = useRentDetail(id, currentReading);

  //Event handler
  // Handle picking an image from the library
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.7,
      });
      const asset = result?.assets?.[0];
      if (asset?.fileName) {
        setFileName(asset.fileName);
      }
      if (asset?.uri) {
        const data = new FormData();
        data.append("file", {
          uri: asset.uri,
          type: "image/jpeg",
          name: asset.fileName || "upload.jpg",
        } as any);
        data.append("upload_preset", "rentra");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dqowzcozm/image/upload",
          {
            method: "POST",
            body: data,
          }
        );

        const file = await res.json();
        if (file.secure_url) {
          setImageUri(file.secure_url);
        }
      }
      // setImageUri()
    } catch (e) {
      console.log(e);
      // ignore / handle error
    }
  };

  const handleUpdate = async () => {
    if (!rent?.electricity_total || !rent?.usage) {
      // First update: current reading
      const payload = {
        electricity_total: electricityStats.totalCost,
        usage: electricityStats.usage,
        total: electricityStats.totalCost + (setting?.room_rate ?? 0),
        id: id,
        current_reading: currentReading,
      };
      await rentService.updateRent(payload);
      await rentService.fetchRents();
      setTimeout(() => {
        router.back();
        setCurrentReading("");
      }, 1500);
    } else if (imageUri) {
      // Second update: payment proof
      const payload = {
        id: id,
        payment_proof: imageUri,
        status: "Paid",
      };
      await rentService.updateRent(payload);
      await rentService.fetchRents();
      setTimeout(() => {
        router.back();
        setImageUri(null);
      }, 2000);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ alignItems: "center", padding: 16 }}>
        <View className="w-full max-w-[420px] flex-row justify-start">
          <TouchableOpacity
            className="flex-row items-center p-2 rounded-md"
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft className="w-4 h-4 text-gray-500" />
            <Text className="ml-2 text-gray-500 font-regular">Back</Text>
          </TouchableOpacity>
        </View>
        <View
          className="w-full max-w-[420px] bg-white rounded-xl p-4 mt-10"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOpacity: Platform.OS === "ios" ? 0.1 : 0,
          }}
        >
          <View className="mb-3">
            <Text className="text-xl font-pbold">{rent?.month}</Text>
            <Text className="text-gray-500">
              Update payment details for {rent?.month}
            </Text>
          </View>

          <View className="flex-row flex-wrap my-3">
            <View className="w-1/2 mb-3">
              <Text className="text-gray-700">Last Reading</Text>
              <Text className="text-base font-semibold">
                {rent?.last_reading} kWh
              </Text>
            </View>

            <View className="w-1/2 mb-3">
              <Text className="text-gray-700 ">Usage</Text>
              <Text className="text-base font-semibold">
                {rent?.status === "Pending"
                  ? typeof electricityStats?.usage === "number" &&
                    !isNaN(electricityStats.usage)
                    ? electricityStats.usage
                    : 0
                  : typeof rent?.usage === "number" && !isNaN(rent?.usage)
                  ? rent.usage
                  : 0}{" "}
                kWh
              </Text>
            </View>

            <View className="w-1/2 mb-3">
              <Text className="text-gray-700 ">Electric Rate</Text>
              <Text className="text-base font-semibold">
                ₱{setting?.electric_rate} /kWh
              </Text>
            </View>

            <View className="w-1/2 mb-3">
              <Text className="text-gray-700 ">Electric Total</Text>
              <Text className="text-base font-semibold text-blue-600">
                ₱{" "}
                {rent?.status === "Pending"
                  ? typeof electricityStats?.totalCost === "number" &&
                    !isNaN(electricityStats.totalCost)
                    ? electricityStats.totalCost
                    : 0
                  : typeof rent?.electricity_total === "number" &&
                    !isNaN(rent?.electricity_total)
                  ? rent.electricity_total
                  : 0}{" "}
              </Text>
            </View>
          </View>

          {rent?.status === "Pending" && !rent?.usage ? (
            <View className="mb-4">
              <Text className="text-sm text-gray-700 mb-1">
                Current Reading
              </Text>
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 py-4 px-3 border border-gray-300 rounded-md bg-white"
                  value={currentReading}
                  onChangeText={setCurrentReading}
                  placeholder="Enter current reading"
                  keyboardType="numeric"
                  style={{ paddingRight: 45 }}
                />
                <Text className="absolute right-3 text-gray-500">kWh</Text>
              </View>
            </View>
          ) : null}

          {/* {rent.} */}
          <View className="mb-4">
            <Text className="text-lg text-gray-700 mb-1">Proof of Payment</Text>

            <TouchableOpacity
              className="h-80 border border-dashed border-gray-300 rounded-md p-2 items-center justify-center"
              disabled={rent?.status === "Paid" ? true : false}
              onPress={pickImage}
            >
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={{ width: "100%", height: "100%", borderRadius: 8 }}
                  resizeMode="cover"
                />
              ) : (
                <View style={{ alignItems: "center" }}>
                  <Text className="text-3xl text-gray-400">⤴︎</Text>
                  <Text className="mt-2 text-gray-500">
                    Tap to upload image/proof
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {fileName ? (
              <Text className="mt-2 text-gray-600">Selected: {fileName}</Text>
            ) : null}
          </View>

          {rent?.status !== "Paid" && (
            <TouchableOpacity
              className="mt-2 bg-blue-600 py-3 rounded-md items-center"
              onPress={handleUpdate}
              activeOpacity={0.7}
            >
              <Text className="text-white font-extrabold">Update Payment</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RentDetailScreen;
