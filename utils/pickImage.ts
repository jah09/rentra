import * as ImagePicker from "expo-image-picker";

export async function pickImage(
  setFileName: (name: string) => void,
  setImageUri: (uri: string) => void
) {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });
    const asset = result?.assets?.[0];
    if (asset?.fileName) setFileName(asset.fileName);
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
      if (file.secure_url) setImageUri(file.secure_url);
    }
  } catch (e) {
    console.log(e);
  }
}
