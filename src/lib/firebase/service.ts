import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  getFirestore,
} from "firebase/firestore";
import app from "./init";
import bcrypt from "bcrypt";

const firestore = getFirestore(app);

export async function retrieveData(collectionName: string) {
  const snapshot = await getDocs(collection(firestore, collectionName));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  return data;
}

export async function retriveDataById(collectionName: string, id: string) {
  const snapshot = await getDocs(doc(firestore, collectionName, id));
  const data = snapshot.data();
  return data;
}

export async function signUp(
  userData: {
    email: string;
    fullname: string;
    phone: string;
    password: string;
    role?: string;
  },
  callback: Function
) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", userData.email)
  );

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (data.length > 0) {
    callback(false);
  } else {
    if (!userData.role) {
      userData.role = "member";
    }
    userData.password = await bcrypt.hash(userData.password, 10);
    await addDoc(collection(firestore, "users"), userData)
      .then(() => {
        callback(true);
      })
      .catch((error) => {
        callback(false);
        console.log(error);
      });
  }
}

// export async function signIn(email: string) {
//   const q = query(collection(firestore, "users "), where("email", "==", email));

//   const snapshot = await getDocs(q);
//   const data = snapshot.docs.map((doc) => ({
//     id: Document.id,
//     ...doc.data(),
//   }));

//   if (data) {
//     return data[0];
//   } else {
//     return null;
//   }
// }

export async function signIn(email: string) {
  const q = query(collection(firestore, "users"), where("email", "==", email));

  const snapshot = await getDocs(q);
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  if (data.length > 0) {
    return data[0];
  } else {
    return null;
  }
}

export async function loginwithGoogle(data: any, callback: Function) {
  const q = query(
    collection(firestore, "users"),
    where("email", "==", data.email)
  );
  const snapshot = await getDocs(q);
  const user = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (user.length > 0) {
    callback(user[0]);
  } else {
    data.role = "member";
    await addDoc(collection(firestore, "users", data));
    callback(data); // Pindahkan ini ke sini agar hanya dijalankan jika pengguna tidak ditemukan.
  }

  // if (user.length > 0) {
  //   callback(user[0]);
  // } else {
  //   data.role = "member";
  //   await addDoc(
  //     collection(firestore, "users", data).then(() => callback(data))
  //   );
  // }
}

// export async function loginwithGoogle(
//   data: any,
//   callback: (userData: any) => void
// ) {
//   try {
//     const userQuery = query(
//       collection(firestore, "users"),
//       where("email", "==", data.email)
//     );

//     const snapshot = await getDocs(userQuery);
//     const user = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     if (user.length > 0) {
//       callback(user[0]);
//     } else {
//       data.role = "member";
//       await addDoc(collection(firestore, "users"), data);
//       callback(data); // Move this line here so it only runs if the user is not found.
//     }
//   } catch (error) {
//     console.error("Error in loginWithGoogle:", error);
//     callback(null); // Pass null or handle the error appropriately in the callback.
//   }
// }
