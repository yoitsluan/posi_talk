import React, { useRef, useState, useEffect, useMemo } from 'react';
import './App.css';
import brain from './brain.png';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyBU0cP1JmSTQojHYHEIhLcFPzpFnTvFpTA",
  authDomain: "positalk-53aa3.firebaseapp.com",
  projectId: "positalk-53aa3",
  storageBucket: "positalk-53aa3.appspot.com",
  messagingSenderId: "196850086185",
  appId: "1:196850086185:web:10062b2950d2dac7898738",
  measurementId: "G-V68H4RTGD2"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);
  const [userDoc, changeUserDoc] = useState(); //profile infor

  // everytime user state changes
  useEffect(async () => {
    // if the user object doesn't exist (aka not logged in) do nothing
    if (!user)
      return;

    console.log(user);
    const unsubscribe = firestore.collection("Users").doc(user.uid).onSnapshot(doc => {
      console.log("hello");

      console.log(doc);
      changeUserDoc(
        doc.data()
      );
    });
    return () => unsubscribe();
  }, [user]);
  
  useEffect(() => {
    console.log("user profile", userDoc);
  }, [userDoc]);

  let screenToShow = "SignIn";

  if (user && userDoc) {
    screenToShow = "ReadyToChat";
  } else if (!userDoc && user) {
    screenToShow = "EditProfile";
  }

  /*
  return (
    <div className = "App">
      <header>
        <h1>positalk</h1> 
        <SignOut />
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  )
  }*/

  return (
    <div className="App">
      <header>
      <div className="top">
      <img src={brain} alt="brain"/>

        <div>PosiTalk</div>
      </div>
      </header>

      <section>
        {screenToShow === "SignIn" ? (
          <SignIn />
          ): null}
        {screenToShow === "EditProfile" ? (
          <EditProfile profile={userDoc} uid={user.uid}/>
          ): null}
        {screenToShow === "ReadyToChat" ? (
          <CreateChat/>
          ): null}
      </section>

    </div>
  )
}

function CreateChat() {
  const [clickedStart, changeClickedStart] = useState(false);
  const [topicPreference, changeTopicPreference] = useState();
  const [roomTypePreference, changeRoomTypePreference] = useState();
  return (
    <div className = "App">
      
      {!clickedStart && (
        <button className="startchatting" onClick={() => changeClickedStart(true)}>Start Chatting</button>
      )}
      {clickedStart && !topicPreference && (
        <>
          <button className="moodbtn" onClick={() => changeTopicPreference("Bad Day")}>Bad Day</button>
          <button className="moodbtn" onClick={() => changeTopicPreference("Need a friend")}>Need a friend</button>
          <button className="moodbtn" onClick={() => changeTopicPreference("Stressed")}>Stressed</button>
          <button className="moodbtn" onClick={() => changeTopicPreference("Chilled Vibes")}>Chilled Vibes</button>
          <button className="moodbtn" onClick={() => changeTopicPreference("Positive")}>Positive</button>
          <button className="moodbtn" onClick={() => changeTopicPreference("Best day ever")}>Best day ever</button>
        </>
      )}
      {clickedStart && topicPreference && !roomTypePreference && (
        <>
          <button onClick={() => changeRoomTypePreference("One-on-one")}>One-on-one</button>
          <button onClick={() => changeRoomTypePreference("Group")}>Group</button>
        </>
      )}
      {clickedStart && topicPreference && roomTypePreference && (
        <h1>The next screen goes here</h1>
        //<h1>positalk</h1>
      )}
      <SignOut />
    </div>
  )
}


function EditProfile({ profile={}, uid}) {
  const [name, changeName] = useState(profile.fullName || "");
  const [bio, changeBio] = useState(profile.Bio || "");
  const [age, changeAge] = useState(profile.Age || "");

  function handleSubmit(e) {
    e.preventDefault();
    firestore.collection("Users").doc(uid).set({ fullName: name, Bio: bio, Age: age })
  }
  return (
    <>
    <p>Create your profile</p>
      <form onSubmit = {handleSubmit}>
        <div className="editbox">
          <div className="labelName">
            <label>Name: </label>
            <input type="textName" placeholder="Name " value={name} onChange={e => changeName(e.target.value)}></input>
          </div>

          <div className="labelAge">
            <label>Age: </label>
            <input type="text" placeholder="Age " value={age} onChange={e => changeAge(e.target.value)}></input>
          </div>

          <div className="labelBio">
            <label>Bio: </label>
            <input type="text" placeholder="Bio " value={bio} onChange={e => changeBio(e.target.value)}></input>
          </div>

          <div className="buttonedit">
        <button className="createprofile" type="submit" >Create Profile</button>
        <SignOut />
        </div>  
        </div>
      </form>

      <div> .</div>
    </>
  )
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }


  return (
    <>
    <p>A safe haven to chat about your mental health with others</p>
    <div className="rowContainer">
      <div className="box">
        <div className="circle">
        <div className="number">1</div>
        </div>
        <div className="partext">Sign in and create a profile to start chatting!</div>
      </div>

      <div className="box">
      <div className="circle">
        <div className="number">2</div>
        </div>
        <div className="partext">Chat with a Posi-Partner or with a group based on your mood!</div>
      </div>

      <div className="box">
      <div className="circle">
        <div className="number">3</div>
        </div> 
        <div className="partext">Give your Posi-Partner(s) a rating!</div>
      </div>

    </div>
      <div className="signInSpan">
      <button className="signin" onClick={signInWithGoogle}>Sign in with Google</button>
      </div>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() { //what if we put in the chat titles as parameters in this function
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
  <>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>
  )
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (
  <>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
      <p>{text}</p>
    </div>
  </>
  )
}


export default App;