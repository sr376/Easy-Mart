import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Main from './components/mainpage';
import Login from './components/auth/Login';
import { selectUser } from './feature/userSlice';
import { auth } from './Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { login} from "./feature/userSlice";




function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        dispatch(
          login({
            userName: authUser.displayName,
            photo: authUser.photoURL,
            email: authUser.email,
            uid: authUser.uid,
          })
        );
        console.log("AuthUser", authUser);
      }
    });
  }, [dispatch]);

  return (
    <div className="App">
      {user ? <Main /> : <Login />}
    </div>
  );
}

export default App;




// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import "./App.css";
// import Login from "./components/auth/Login";
// import Main from './components/mainpage';
// import { login, selectUser } from "./feature/userSlice";
// import { auth } from "./Firebase";
// import { onAuthStateChanged } from "firebase/auth";

// function App() {
//   const user = useSelector(selectUser);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     onAuthStateChanged(auth, (authUser) => {
//       if (authUser) {
//         dispatch(
//           login({
//             userName: authUser.displayName,
//             photo: authUser.photoURL,
//             email: authUser.email,
//             uid: authUser.uid,
//           })
//         );
//         console.log("AuthUser", authUser);
//       }
//     });
//   }, [dispatch]);
//   return (
//     <div className="App">
//       {/* <h1>This is for testing</h1> */}
//       {user ? <Main /> : <Login />}
//     </div>
//   );
// }

// export default App;
