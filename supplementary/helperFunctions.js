const fs = require('fs');
const admin = require('firebase-admin');

// Initializing firebase
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SERVER_KEY))
})

// Initializing instance of firestore
const db = admin.firestore();

module.exports.fetchMeaning = async function (){
    const docRef = db.collection('supplementary').doc('completed');
    const doc = await docRef.get();

    if (!doc.exists){
        return 'ERROR', 'Document does not exists'
    } else {
        return 'SUCCESS', doc.data();
    }
}

module.exports.fetchSubscriptURL = function (){
    return new Promise( async(resolve, reject) => {
        const snapshot = db.collection('subscriptions').doc('client1');
        const doc = await snapshot.get()

        if (!doc.exists){
            reject('No such Document exists, please check path');
        } else {
            resolve(JSON.parse(doc.data()[0]))
        }
    })
}

module.exports.log = function(text){
    fs.appendFile('log.txt', text + '\n', (err) => {
        if (err){
            console.log(err);
        }
    })
}