import { collection, db, getDocs } from "@/config/firebase";

export const fetchSettings = async () => {
  try {
    const settingsRef = collection(db, "setting");
    const querySnapshot = await getDocs(settingsRef);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting collection data:", error);
    return []; 
  }
};
