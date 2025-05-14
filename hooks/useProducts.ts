import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';

export interface Product {
  id: string;
  category: string;
  description: string;
  image: string;
  name: string;
  price: number;
  seller: string;
}

export function useProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    const colref = collection(db, 'products');
    const unsubscribe = onSnapshot(
      colref,
      (snapshot) => {
        const fetchedData = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            category: docData.category,
            description: docData.description,
            image: docData.image,
            name: docData.name,
            price: docData.price,
            seller: docData.seller,
          };
        });
        setData(fetchedData);
        setIsLoading(false);
      },
      (err) => {
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { data, isLoading, error, setData };
}