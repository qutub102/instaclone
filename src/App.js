import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 230,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "10px",
  },
}));

function App() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const [posts, setposts] = useState([]);
  const [open, setopen] = useState(false);
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [openImageUpload, setOpenImageUpload] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setposts(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  });
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(Email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));
    setopen(false);
  };

  const signIn = (event) => {
    event.preventDefault();
    auth
      .signInWithEmailAndPassword(Email, password)
      .catch((error) => alert(error.message));
    setOpenSignIn(false);
  };

  return (
    <div className="App">
      <Modal open={open} onClose={() => setopen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="data:image/png;base64,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"
                alt="instagram_logo"
              />
            </center>
            <Input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></Input>
            <Input
              placeholder="Email"
              type="text"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type="submit" onClick={signUp}>
              SignUp
            </Button>
          </form>
        </div>
      </Modal>

      {/* Login Modal */}
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="data:image/png;base64,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"
                alt="instagram_logo"
              />
            </center>
            <Input
              placeholder="Email"
              type="text"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
            ></Input>
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Input>
            <Button type="submit" onClick={signIn}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>

      {/* Image Upload Button */}
      <Modal open={openImageUpload} onClose={() => setOpenImageUpload(false)}>
        <div style={modalStyle} className={classes.paper}>
          {user?.displayName ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h3>Sorry You Need To Log In First</h3>
          )}
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="data:image/png;base64,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"
          alt="instagram_logo"
        />
        {user ? (
          <div>
            <Button onClick={() => setOpenImageUpload(true)}>Upload</Button>
            <Button onClick={() => auth.signOut()}>Logout</Button>
          </div>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Login</Button>
            <Button onClick={() => setopen(true)}>SignUp</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({ id, post }) => {
            return (
              <Post
                key={id}
                postId={id}
                user={user}
                userName={post.username}
                caption={post.caption}
                imgUrl={post.imgUrl}
              />
            );
          })}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url="https://www.instagram.com/p/4uU6XIjDeN/?utm_source=ig_web_copy_link"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {/* {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>Sorry You Need To Log In First</h3>
      )} */}
    </div>
  );
}

export default App;
