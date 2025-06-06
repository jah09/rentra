import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Text, View } from "react-native";

const HomeScreen = () => {
  return (
    <View className="py-2 px-4 ">
      <View>
        <Card className="mb-4">
          <CardHeader className="flex-row justify-between items-center">
            <View>
              <CardTitle className="text-2xl">May</CardTitle>
              <CardDescription className="text-muted-foreground">
                Payment for the month of May
              </CardDescription>
            </View>
            <View className="rounded-full px-3 py-0.5 bg-accent">
              <Text className="text-muted font-medium">Paid</Text>
            </View>
          </CardHeader>
          <CardContent>
            <View>
              {/* Room */}
              <View className="flex flex-row justify-between items-center mb-2">
                <View className="flex gap-x-2 flex-row">
                  <Text className="text-xl">🏠</Text>
                  <Text className="text-lg font-medium">Room</Text>
                </View>
                <Text className="">₱ 3500</Text>
              </View>
              {/* Electricity */}
              <View>
                <View className="flex gap-x-2 flex-row">
                  <Text className="text-xl">⚡</Text>
                  <Text className="text-lg font-medium">
                    Electricity Summary
                  </Text>
                </View>
                <View className="flex flex-row justify-between py-1">
                  <Text className="px-[30px]">Last reading</Text>
                  <Text className="">510 kWh</Text>
                </View>
                <View className="flex flex-row justify-between py-1">
                  <Text className="px-[30px]">Current reading</Text>
                  <Text className="">520 kWh</Text>
                </View>
                <View className="flex flex-row justify-between py-1">
                  <Text className="px-[30px]">Usage</Text>
                  <Text className="">10 kWh</Text>
                </View>
                <View className="flex flex-row justify-between py-1">
                  <Text className="px-[30px]">Rate</Text>
                  <Text className="">₱ 22/kWh</Text>
                </View>
              </View>
            </View>
          </CardContent>
          <CardFooter>
            <View className="flex flex-1 flex-row justify-between items-center">
              <View className="flex gap-x-2 flex-row">
                <Text className="text-xl">💰</Text>
                <Text className="text-lg font-medium">Total</Text>
              </View>
              <Text className="font-bold tracking-normal text-lg">₱ 5000</Text>
            </View>
          </CardFooter>
        </Card>
      </View>
    </View>
  );
};

export default HomeScreen;
