import { useQuery } from "@tanstack/react-query";
import { addDoc, collection, getDocs, orderBy, query, setDoc, where } from "firebase/firestore"

import { db } from "../firebase/config"
import { ActivitySchema } from "../types";

const fetchActivityLogs = async (userId: string): Promise<ActivitySchema[]> => {
  if(!userId) return [];

  try {
    const activitiesRef = collection(db, "activities");
    const q = query(activitiesRef, where("userId", "==", userId), orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const fetchedActivities:ActivitySchema[] = querySnapshot.docs.map(doc => {
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

export const useActivityLogs = (userId: string | undefined) => {
  return useQuery<ActivitySchema[]>({
    initialData: [],
    queryKey: ["activities", userId],
    queryFn: () => fetchActivityLogs(userId ?? ""),
    enabled: !!userId,
  })
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
