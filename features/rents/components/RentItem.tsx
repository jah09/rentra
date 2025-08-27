import { Rent, Setting } from "@/app/(drawer)/rent/index";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const RentItem = ({
  item,
  setting,
  onPress,
}: {
  item: Rent;
  setting?: Setting;
  onPress: () => void;
}) => (
  <TouchableOpacity
    onPress={onPress}
    accessibilityRole="button"
    activeOpacity={0.7}
  >
    <Card className="mb-4">
      <CardHeader className="flex-row justify-between items-center">
        <View>
          <CardTitle className="text-2xl">{item.month}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Payment for the month of {item.month}
          </CardDescription>
        </View>
        <View className={`capitalize rounded-full px-3 py-0.5 ${item.status === 'Paid' ? "bg-accent": "bg-destructive"} `}>
          <Text className="text-muted font-medium">{item.status}</Text>
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
            <Text className="">₱ {setting ? setting.room_rate : "3500"}</Text>
          </View>
          {/* Electricity */}
          <View>
            <View className="flex gap-x-2 flex-row">
              <Text className="text-xl">⚡</Text>
              <Text className="text-lg font-medium">Electricity Summary</Text>
            </View>
            <View className="flex flex-row justify-between py-1">
              <Text className="px-[30px]">Last reading</Text>
              <Text className="">{item.last_reading} kWh</Text>
            </View>
            <View className="flex flex-row justify-between py-1">
              <Text className="px-[30px]">Current reading</Text>
              <Text className="">{item.current_reading} kWh</Text>
            </View>
            <View className="flex flex-row justify-between py-1">
              <Text className="px-[30px]">Usage</Text>
              <Text className="">{item.usage} kWh</Text>
            </View>
            <View className="flex flex-row justify-between py-1">
              <Text className="px-[30px]">Rate</Text>
              <Text className="">
                ₱ {setting ? `${setting.electric_rate}/kWh` : "22/kWh"}
              </Text>
            </View>
            <View className="flex flex-row justify-between py-1">
              <Text className="px-[30px] font-medium">Electricity Total</Text>
              <Text className="font-bold">₱ {item.electricity_total}</Text>
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
          <Text className="font-bold tracking-normal text-lg">
            ₱ {item.total}
          </Text>
        </View>
      </CardFooter>
    </Card>
  </TouchableOpacity>
);
export default RentItem;
