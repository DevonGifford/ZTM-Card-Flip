import { UserProfile, defaultUserProfile } from "@/types/UserProfile";
import db from "../firebase/firebaseConfig";
import {
  Firestore,
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  getDoc,
  DocumentReference,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";

type CollectionName = string;
type DocumentId = string;
type Data = Record<string, any>;

// 👇 Ensure the db object typing is Firestore
const firestore: Firestore = db;

// ✅ HELPER FUNCTION: creates/updates a specified document in a specified collection
export const updateDocument = async (
  collectionName: CollectionName,
  documentId: DocumentId,
  data: Data
) => {
  console.log(
    "🎯event_log:  🔥utils/firestore/updateDocument/updateDocument:  💢 Triggered"
  );
  const collectionRef = collection(firestore, collectionName);
  const docRef: DocumentReference<Data> = doc(collectionRef, documentId);

  try {
    const docSnapshot: DocumentSnapshot<Data> = await getDoc(docRef);

    // - check if user doc exists and update or else create new
    if (docSnapshot.exists()) {
      await updateDoc(docRef, data);
      console.log(
        `🎯event_log:  🔥utils/firestore/updateDocument:  ✔ Success:  Document ${documentId} updated successfully in collection ${collectionName}!`
      );
    } else {
      await setDoc(docRef, data);
      console.log(
        `🎯event_log:  🔥utils/firestore/updateDocument:  ✔ Success:  Document ${documentId} created successfully in collection ${collectionName}!`
      );
    }
    return true;
  } catch (error: any) {
    console.error(
      `🎯event_log:  🔥utils/firestore/updateDocument:  ❌ Error:  Error updating/creating document ${documentId} in collection ${collectionName}: `,
      error
    );
    return false;
  }
};

// ✅ AUTH/REGISTER HELPER FUNCTION : helps create default user data in registration process.
export const mergeUserDataWithDefaults = (
  userData: Partial<UserProfile>
): UserProfile => {
  return {
    ...defaultUserProfile, //-default user
    ...userData, //-provided data with defaults
  };
};

// ✅ AUTH/REGISTER HELPER FUNCTION : creates a new user doc in registration process.
export const createUserDataProcess = async (
  documentId: string,
  userData: Partial<UserProfile>
) => {
  console.log(
    "🎯 event_log:  🔥utils/firestore/createUserDataProcess:  💢 Triggered"
  );

  try {
    const collectionRef = collection(firestore, "users");
    const docRef: DocumentReference<Data> = doc(collectionRef, documentId);
    const docSnapshot: DocumentSnapshot<Data> = await getDoc(docRef);

    //-Ensure user doc does NOT exist
    if (docSnapshot.exists()) {
      console.log(
        `🎯 event_log:  🔥utils/firestore/createUserDataProcess:  ⚠ Warning -  Document ${documentId} already exists in collection "users"`
      );
    } else {
      //-manipulate the data
      const defaultUserData: Partial<UserProfile> = {
        ...userData,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };
      const mergedUserData = mergeUserDataWithDefaults(defaultUserData);
      console.log(
        "🎯 event_log:  🔥utils/firestore/createUserDataProcess:  🖇 Merge complete - creating the following document",
        "Document ID: ",
        documentId,
        "Document Data: ",
        mergedUserData
      );

      // - Create a new document with provided user data
      await setDoc(docRef, mergedUserData);

      // -Update the state with the newly created user data
      // 🎯 to-do-list:  logic will be added in updating user-profile-form update ()

      console.log(
        `🎯 event_log:  🔥utils/firestore/createUserDataProcess:  ✔ Success - Document ${documentId} created successfully in collection "users"!`
      );
    }
  } catch (error: any) {
    console.error(
      `🎯 event_log:  🔥utils/firestore/createUserDataProcess Error creating document ${documentId} in collection `,
      error
    );
  }
};

// ✅ AUTH/LOGIN HELPER FUNCTION :  updates users login-time in logging in process.
export const updateUserLoginTime = async (documentId: string) => {
  console.log(
    "🎯 event_log:  🔥utils/firestore/updateUserLoginTime:  💢 Triggered"
  );

  try {
    const collectionRef = collection(firestore, "users");
    const docRef: DocumentReference<Data> = doc(collectionRef, documentId);
    const docSnapshot: DocumentSnapshot<Data> = await getDoc(docRef);

    //-Ensure user doc does NOT exist
    if (docSnapshot.exists()) {
      // - Update users document with new login data
      const lastLogin = new Date().toISOString();
      await updateDoc(docRef, { lastLogin });

      // -Update the state with the newly created user data
      // 🎯 to-do-list:  logic will be added in updating user-profile-form update ()

      console.log(
        `🎯 event_log:  🔥utils/firestore/updateUserLoginTime: ✔ Success -  Updated Document ${documentId} with new login time:  ${lastLogin}!`
      );
    } else {
      console.log(
        `🎯 event_log:  🔥utils/firestore/updateUserLoginTime:  ⚠ Warning -  Document ${documentId} does not exist in "users"`
      );
    }
  } catch (updateError: any) {
    console.error(
      "🎯 event_log:  🔥utils/firestore/updateUserLoginTime:  ❌ Error - An error occurred during updating user document:",
      updateError.message
    );
  }
};

// ⌛✅ SPEACIAL ONE-TIME FUNCTION:  creates a new collection based on input TypeScript type
export const createCollection = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<boolean> => {
  console.log(
    `🎯 event_log:  🔥utils/firestore/createCollection:  💢 Triggered`
  );
  try {
    const dataCollection = collection(firestore, collectionName);
    await addDoc(dataCollection, data);
    console.log(
      `🎯 event_log:  🔥utils/firestore/createCollection:  ✔ Success:  Added ${collectionName} collection with data.`
    );
    return true;
  } catch (error) {
    console.error(
      `🎯 event_log:  🔥utils/firestore/createCollection:  ❌ Error adding document: ${error}`
    );
    return false;
  }
};
