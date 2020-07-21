import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { db, storage } from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

const ImageUpload = ({ username }) => {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState();

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };
  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
        alert(error.message);
      },
      () => {
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // post image inside db
            db.collection("posts").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imgUrl: url,
              username: username,
            });
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <h4>Upload Images From here</h4>
      <br></br>
      <progress className="imageUpload__progress" value={progress} max="100" />
      <input
        type="text"
        className="imageUpload__input"
        placeholder="Enter a Caption..."
        onChange={(event) => setCaption(event.target.value)}
        value={caption}
      />
      <input
        type="file"
        className="imageUpload__file"
        onChange={handleChange}
      />
      <Button
        className="imageUpload__button"
        type="submit"
        onClick={handleUpload}
      >
        Upload
      </Button>
    </div>
  );
};
export default ImageUpload;
