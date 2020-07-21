import React, { useState, useEffect } from "react";
import "./Post.css";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import firebase from "firebase";

const Post = (props) => {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  let { postId, user, userName, caption, imgUrl } = props;
  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt="Remy Sharp"
          src="/static/images/avatar/1.jpg"
        />
        <h3>{userName}</h3>
      </div>
      <img className="post__image" src={imgUrl} alt={userName} />
      <h4 className="post__text">
        <strong>{userName}</strong> : {caption}
      </h4>

      <div className="post__comments">
        <span className="post__viewComment">View Comments</span>
        {comments.map((comment) => {
          return (
            <p>
              <b>{comment.username} :</b>
              {comment.text}
            </p>
          );
        })}
      </div>
      {user && (
        <form className="post__commentBox">
          <input
            type="text"
            placeholder="Add a comments.."
            className="post__input"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type="submit"
            className="post__button"
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
};
export default Post;
