import firebase from 'firebase';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyApUjRfiHLDOMVWEfsAB5jXMKn3CbbgBZI",
    authDomain: "instagram-clone-react-eb4bd.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-eb4bd.firebaseio.com",
    projectId: "instagram-clone-react-eb4bd",
    storageBucket: "instagram-clone-react-eb4bd.appspot.com",
    messagingSenderId: "107735420622",
    appId: "1:107735420622:web:d98911d06e83d4f12d4a9f",
    measurementId: "G-G8JSWCC7HD"
});
console.log(firebaseApp);
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage};


