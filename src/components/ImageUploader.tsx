import React, { useState } from 'react';
import { auth, storage, STATE_CHANGED } from '../lib/firebase';
import Loader from './Loader';

// Uploads images to Firebase Storage
const ImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  // Create a Firebase upload task
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the file
    const file = (e.target.files as FileList)[0];
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const ref = storage.ref(
      `uploads/${auth.currentUser?.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const pct = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);
      setProgress(Number(pct));

      // Get downloadURL AFTER task resolves
      task
        .then(() => ref.getDownloadURL())
        .then((url) => {
          setDownloadURL(url);
          setUploading(false);
        });
    });
  };

  return (
    <div className='box'>
      <Loader show={uploading} />
      {uploading && <h3>{progress}</h3>}

      {!uploading && (
        <>
          <label htmlFor='image' className='btn'>
            📸 Upload Img
            <input
              id='image'
              type='file'
              onChange={uploadFile}
              accept='image/x-png,image/gif,image/jpeg'
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className='upload-snippet'>{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
};

export default ImageUploader;
