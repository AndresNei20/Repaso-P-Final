import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, onSnapshot, query, orderBy} from "firebase/firestore";
import { Product } from "../types/products";
import { getAuth,
     onAuthStateChanged,
     createUserWithEmailAndPassword,
     signInWithEmailAndPassword,
     setPersistence,
     browserSessionPersistence
    } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyDspPx-vS1vk3TMBi0j4kO40mHq4L9BtrE",
    authDomain: "repasotaller.firebaseapp.com",
    projectId: "repasotaller",
    storageBucket: "repasotaller.appspot.com",
    messagingSenderId: "952722693333",
    appId: "1:952722693333:web:4d5116201405a9a8d4d65c",
    measurementId: "G-ZXQ2098JR4"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app)

  const registerUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(userCredential.user);
      return true;
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      return false;
    }
  };
  
  const loginUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    setPersistence(auth, browserSessionPersistence)
    .then(() => {
      return signInWithEmailAndPassword(auth, email, password);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
  };
  
  /////////////////////// DB
  
  
  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const where = collection(db, "products");
      await addDoc(where, { ...product, createdAt: new Date() }); // add createdAt field
      console.log("se añadió con éxito");
    } catch (error) {
      console.error(error);
    }
  };
  
  
  const getProducts = async () => {
    const q = query(collection(db, "products"), orderBy("createdAt")); // order by createdAt
    const querySnapshot = await getDocs(q);
    const transformed: Array<Product> = [];
  
    querySnapshot.forEach((doc) => {
      const data: Omit<Product, "id"> = doc.data() as any;
      transformed.push({ id: doc.id, ...data });
    });
  
    return transformed;
  };
  
  const getProductsListener = (cb: (docs: Product[]) => void) => {
    const q = query(collection(db, "products"), orderBy("createdAt")); // order by createdAt
    onSnapshot(q, (collection) => {
      const docs: Product[] = collection.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      cb(docs);
    });
  };
  
  export {auth}
  export {db}
  export default {
    addProduct,
    getProducts,
    getProductsListener,
    registerUser,
    loginUser,
    onAuthStateChanged,
  };

