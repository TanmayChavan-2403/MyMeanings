import { getFirestore } from "firebase/firestore";
import { deleteField, updateDoc, collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";

import app, { messaging } from "./CONFIG.js"

const db = getFirestore(app);
const SIDocRef = doc(db, 'subscriptions', "info")

export function deleteSubscription(){
	return new Promise((resolve, reject) => {
		const docRef = doc(db, 'subscriptions', 'client2');
		const docRef2 = doc(db, 'subscriptions', 'info');
		setDoc(docRef, {
			0: null
		}, {merge: true})
		setDoc(docRef2, {
			notificationStatus: false
		}, {merge: true})
	})
}

export function getInfo(){
	return new Promise(async(resolve, reject) => {
		const docRef = doc(db, 'subscriptions', 'info')
		const docSnap = await getDoc(docRef)
	 	if (docSnap.exists()) {
			resolve(docSnap.data())
	 	} else {
			// doc.data() will be undefined in this case
			reject('Something went wrong in [getStatus]');
	  	}
	})
}

export function updateInfo(storageType, type=0){
	if (type == 0){
		try{
			setDoc(SIDocRef, {storageQuestion: true,storageType: storageType}, {merge: true})
		} catch(err){
			console.log('ERROR: updateInfo(firebase.js) [TYPE 0]', err)
		}
	} else if (type == 1){
		try {
			setDoc(SIDocRef, {isDataStoredInLocalStorage: true}, {merge: true})
		} catch (error) {
			console.log('ERROR: updateInfo(firebase.js) [TYPE 1]', error)
		}
	}
}

export async function storeSubscription(subscription, status, client='client2'){
	return new Promise((resolve, reject) => {
		const docRef = doc(db, 'subscriptions', client)
		try{
			setDoc(docRef, {
				0: subscription
			})
			// Update notificationStatus in database
			setDoc(SIDocRef, {
				notificationStatus: status
			}, {merge: true})
			resolve('Subscription URL saved to database Successfully!')
		} catch(err) {
			reject('Failed to save URL')
		}
	})
}

export async function getCollection(folder, tag=""){
	let colRef;
	if (tag.length !== 0){
		colRef = doc(db, folder, tag)
	  return await getDoc(colRef);
	} else {
		colRef = collection(db, folder);
  	return await getDocs(colRef);

	}
}

export async function getDataFromDb() {
  const colRef = doc(db, "folders");
  const docSnap = await getDoc(colRef);

  if (docSnap.exists()) {
	console.log("Document data:", docSnap.data());
  } else {
	// doc.data() will be undefined in this case
	console.log("No such document!");
  }
}

export const storeDataInDb = (data) =>{
  const {word, meaning, pinned, folderName, isNewfolder} = data;
  let tag = ""
  if (folderName != "mix"){
	tag = folderName.slice(0, 5);
  };

  // Check if user have create new folder
  if (isNewfolder) addNewFolder(folderName);
  
  let docRef = doc(db, "folders", folderName)
  return new Promise((resolve, reject) => {
		try{
		  setDoc(docRef, 
			{ 
			  [word]: {
				isComplete: false,
				meaning: meaning,
				pinned: pinned,
				tag: tag,
				docId: folderName
			  }
			}, {merge: true});
		  resolve('Data added to database');
		} catch(err){
		  reject("FAILED!" + err)
		}
  })
}

const addNewFolder = (name) => {

  return new Promise( async (resolve, reject) => {

	// First get the array from firestore to update new name and count field
	let count, names;
	getFolderInfo()
	.then(data => {
	  names = data.names;
	  count = names.push(name); // push method adds new item in arr and return its length
	})
	.catch(err => console.log('ERROR!', err))

	// Create a docRef/Path in which the data will be stored.
	const docPath = doc(db, "supplementary", "folderInfo");
	const docSnap = await getDoc(docPath);
	try{
	  updateDoc(docPath,
		{
		  count: count,
		  names: names
		},
		{merge: true});
	}
	catch (err) {
	  reject(err)
	}
  })
}

export const getFolderInfo = () => {
  return new Promise( async (resolve, reject) => {
	const docPath = doc(db, "supplementary", "folderInfo");
	const docSnap = await getDoc(docPath);
	if (docSnap.exists()){
	  resolve(docSnap.data());
	} else {
	  reject("No such document found!");
	}
  })
}

export const addToCompletedList = (data, key) => {
  updateWordStatus(data, key, true);
  return new Promise( (resolve, reject) => {
	const docPath = doc(db, "supplementary", "completed");
	try{
	  setDoc(docPath,
	  {
		[key] : data[key]["meaning"]
	  }, {merge: true});
	  resolve("Database updated.");
	} catch(err){
	  reject("Failed to update in database.")
	}
  })
}

export const removeFromCompletedList = (data, key) => {
	updateWordStatus(data, key, false);
  	return new Promise((resolve, reject) => {
		const docPath = doc(db, "supplementary", "completed");
		try{
	  		updateDoc(docPath,{
			[key]: deleteField()
	  	});
	  	resolve("Removed from completed list");
		}
		catch(err){
		 	reject("Error while remove word from completed list");
		}
	})
}

const updateWordStatus = (data, key, status) => {
	let docRef = doc(db, "folders", data[key]["docId"]);
  	setDoc(docRef, {
  		[key]: {
  			isComplete: status
  		}
  	}, {merge: true})
}

export const updatePinStatus = (data, key, action) => {
	if (action == "pin"){
		action = true
	} else {
		action = false
	}
	let docRef = doc(db, "folders", data[key]["docId"]);
	return new Promise((resolve, reject) => {
		try{
			setDoc(docRef, {
				[key] : {
					pinned: action
				}
			}, {merge: true})
			resolve("Updated pin status in database")
		} catch {
			reject("Failed to update pin status in database")
		}
	})
}

export const deleteListFromDB = (key, data) => {
	return new Promise( (resolve, reject) => {
		let docRef = doc(db, 'folders', data[key]['docId'])
		try{
			updateDoc(docRef, {
				[key]: deleteField()
			})
			resolve('Deleted successfully');
		} catch(err){
			reject(err);
		}
	})
}