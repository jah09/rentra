import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { View } from "react-native";
export default function HomeScreen() {
  return (
    <View className="text-green-500">
      <Text className="mt-10 text-red-900 font-regular text-lg"> This is sample1!</Text>
      <Text className="mt-10 text-red-900 font-regular"> This is sample12!</Text>

      <Button className="mt-10" variant="default" size={"lg"}>
        <Text className="font-pbold">Press Mea</Text>
      </Button>
    </View>
  );
}
