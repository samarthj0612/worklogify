import { addDoc, collection, getDocs, query, setDoc, where } from "firebase/firestore"
import { db } from "../firebase/config"
import { ActivitySchema } from "../types";

export const fetchActivityLogs = async (userId: string) => {
  try {
    const activitiesRef = collection(db, "activities");
    const q = query(activitiesRef, where("userId", "==", userId));

    const querySnapshot = await getDocs(q);
    const fetchedActivities = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        type: data?.type,
        activity: data.activity,
        userId: data.userId,
        createdAt: data.createdAt
      } as ActivitySchema;
    });

    return fetchedActivities;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export const createActivityLog = async (activity: string, type: string, userId: string) => {
  const docRef = await addDoc(collection(db, "activities"), {
    activity,
    type: type || "activity",
    userId,
    createdAt: new Date().toISOString()
  });

  await setDoc(docRef, { id: docRef.id }, { merge: true });
}
