import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  query, 
  where,
  orderBy
} from 'firebase/firestore';

const COLLECTION_NAME = 'accounts';

export async function getAccounts() {
  const accountsCol = collection(db, COLLECTION_NAME);
  const accountsSnapshot = await getDocs(accountsCol);
  return accountsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

export async function addAccount(accountData) {
  const accountsCol = collection(db, COLLECTION_NAME);
  const docRef = await addDoc(accountsCol, {
    ...accountData,
    createdAt: new Date().toISOString()
  });
  return {
    id: docRef.id,
    ...accountData
  };
}

export async function deleteAccount(accountId) {
  const accountRef = doc(db, COLLECTION_NAME, accountId);
  await deleteDoc(accountRef);
}

export async function updateAccountStatus(accountId, status) {
  const accountRef = doc(db, COLLECTION_NAME, accountId);
  await updateDoc(accountRef, { status });
}

export async function searchAccounts(platform = '', type = '', searchTerm = '') {
  const accountsCol = collection(db, COLLECTION_NAME);
  let constraints = [];

  if (platform && platform !== 'الكل') {
    constraints.push(where('platform', '==', platform));
  }
  
  if (type && type !== 'الكل') {
    constraints.push(where('type', '==', type));
  }

  if (searchTerm) {
    constraints.push(where('username', '>=', searchTerm));
    constraints.push(where('username', '<=', searchTerm + '\uf8ff'));
  }

  constraints.push(orderBy('createdAt', 'desc'));

  const q = query(accountsCol, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
