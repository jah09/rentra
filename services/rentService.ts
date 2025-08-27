import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "@/config/firebase";

export const rentService = {
  fetchRents: async () => {
    try {
      const rentsRef = collection(db, "rent");
      const querySnapshot = await getDocs(rentsRef);
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("fetchRents ; Error getting rent data:", error);
      return [];
    }
  },

  fetchRent: async (id: string | undefined) => {
    try {
      if (!id) {
        throw new Error("Invalid rent ID");
      }

      // Convert to string and trim any whitespace
      const rentId = String(id).trim();
      const rentDoc = doc(db, "rent", rentId);
      const docSnap = await getDoc(rentDoc);

      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (error) {
      return null;
    }
  },

  createRent: async (rent: Record<string, any>) => {
    try {
      const rentsRef = collection(db, "rent");
      const { id, ...rentWithoutId } = rent;
      const docRef = await addDoc(rentsRef, rentWithoutId);
      const newRent = { id: docRef.id, ...rentWithoutId };
      return newRent;
    } catch (error) {
      console.error("Error creating rent:", error);
      throw error;
    }
  },

  updateRent: async (payload: Record<string, any>) => {
    try {
      const rentRef = doc(
        db,
        "rent",
        Array.isArray(payload.id) ? payload.id[0] : payload.id
      );

      // Build update object only with provided fields
      const updateData: Record<string, any> = {};
      if (payload.current_reading !== undefined)
        updateData.current_reading = parseFloat(payload.current_reading);
      if (payload.usage !== undefined) updateData.usage = payload.usage;
      if (payload.electricity_total !== undefined)
        updateData.electricity_total = payload.electricity_total;
      if (payload.total !== undefined) updateData.total = payload.total;
      if (payload.payment_proof !== undefined)
        updateData.payment_proof = payload.payment_proof;
      if (payload.status !== undefined) updateData.status = payload.status;

      await updateDoc(rentRef, updateData);
    } catch (error) {
      console.error("Error updating rent:", error);
      throw error;
    }
  },
};
