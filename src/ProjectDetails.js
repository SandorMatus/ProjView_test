// src/ProjectDetails.js
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";

const ProjectDetails = ({ projectId, onClose, refreshProjects }) => {
    const [project, setProject] = useState(null); // State to hold project details
    const [username, setUsername] = useState(""); // State for username
    const [comment, setComment] = useState(""); // State for comment
    const [selectedStatus, setSelectedStatus] = useState(""); // State for selected status

    useEffect(() => {
        const fetchProjectDetails = async () => {
            const docRef = doc(db, "projects", projectId); // Use projectId prop
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setProject({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.error("No such document!");
            }
        };

        fetchProjectDetails();
    }, [projectId]);

    const updateStatus = async (newStatus) => {
        const docRef = doc(db, "projects", projectId); // Use projectId prop
        await updateDoc(docRef, { status: newStatus });
        // Fetch updated project details after status change
        const updatedDocSnap = await getDoc(docRef);
        setProject({ id: updatedDocSnap.id, ...updatedDocSnap.data() });
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        if (username.trim() && comment.trim()) {
            const docRef = doc(db, "projects", projectId); // Use projectId prop
            await updateDoc(docRef, {
                comments: arrayUnion({ username, comment }) // Store comments as an array
            });
            setComment(""); // Clear comment input
            setUsername(""); // Clear username input
            // Fetch updated project details to refresh comments
            const updatedDocSnap = await getDoc(docRef);
            setProject({ id: updatedDocSnap.id, ...updatedDocSnap.data() });
            refreshProjects(); // Refresh the project list after submitting a comment
        }
    };

    // New function to handle status change
    const handleStatusChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    // New function to handle status submission
    const handleSubmit = async () => {
        if (selectedStatus) {
            await updateStatus(selectedStatus);
            setSelectedStatus(""); // Clear the selected status after submission
        } else {
            alert("Please select a status before submitting.");
        }
    };

    if (!project) {
        return <div>Loading...</div>; // Show loading state while fetching
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={() => { onClose(); refreshProjects(); }}>&times;</span>
                <h2>Project Details</h2>
                <h3>{project.title}</h3>
                <p>Created At: {new Date(project.createdAt.toDate()).toLocaleString()}</p>
                <p>Status: {project.status}</p>

                <h4>Comments:</h4>
                <ul>
                    {project.comments && project.comments.map((c, index) => (
                        <li key={index}><strong>{c.username}:</strong> {c.comment}</li>
                    ))}
                </ul>

                <form onSubmit={handleCommentSubmit}>
                    <div>
                        <input  
                            id="name_input"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Your Name"
                            required
                        />
                    </div>
                    <div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Your Comment"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit">Submit Comment</button>
                    </div>
                </form>

                <div style={{ marginTop: "20px" }}>
                    <select value={selectedStatus} onChange={handleStatusChange}>
                        <option value="">Select a status</option>
                        <option value="active">Set Active</option>
                        <option value="new">Set New</option>
                        <option value="hold">Set Hold</option>
                        <option value="end">Set Ended</option>
                    </select>
                    
                    {/* Submit button */}
                    <button onClick={handleSubmit}>Submit Status</button>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
