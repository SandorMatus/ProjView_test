// src/ProjectDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

const ProjectDetails = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchProjectDetails = async () => {
      const projectDoc = doc(db, "projects", id);
      const docSnap = await getDoc(projectDoc);

      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
        setComment(docSnap.data().comment || ""); // Set initial comment
      } else {
        console.log("No such document!");
      }
    };

    fetchProjectDetails();
  }, [id]);

  const handleCommentUpdate = async () => {
    if (project) {
      await updateDoc(doc(db, "projects", project.id), {
        comment: comment
      });
      alert("Comment updated successfully!");
    }
  };

  if (!project) {
    return <div>Loading...</div>; // Show loading state while fetching
  }

  return (
    <div>
      <h2>{project.title}</h2>
      <p>Created on: {project.createdAt.toDate().toString()}</p> {/* Assuming createdAt is a Firestore Timestamp */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Edit your comment here"
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handleCommentUpdate}>Save Comment</button>
    </div>
  );
};

export default ProjectDetails;
