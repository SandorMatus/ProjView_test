// src/App.js
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom"; 
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import './Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRightToBracket } from '@fortawesome/free-solid-svg-icons';



function App() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [error, setError] = useState(""); // State for error messages
  const navigate = useNavigate(); // Hook to programmatically navigate

  // Fetching projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      const projectCollection = collection(db, "projects");
      const projectSnapshot = await getDocs(projectCollection);
      const projectList = projectSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setProjects(projectList);
    };
    fetchProjects();
  }, []);

  // Adding a project
  const addProject = async () => {
    if (searchTerm.trim()) {
      const docRef = await addDoc(collection(db, "projects"), { title: searchTerm });
      setProjects([...projects, { id: docRef.id, title: searchTerm }]); // Update projects state
      setSearchTerm("");
    }
  };

// Function to open a project and navigate to its details
const openProject = (id) => {
    navigate(`/projects/${id}`); // Navigate to the project details page
    };

  // Deleting a project by ID
  const deleteProject = async (id) => {
    await deleteDoc(doc(db, "projects", id));
    setProjects(projects.filter(project => project.id !== id)); // Update projects state
  };

  // Deleting project by title
  const deleteByTitle = async () => {
    const projectToDelete = projects.find((p) => p.title === searchTerm);
    if (projectToDelete) {
      await deleteDoc(doc(db, "projects", projectToDelete.id));
      setProjects(projects.filter(project => project.id !== projectToDelete.id)); // Update projects state
      setSearchTerm("");
      setError(""); // Clear any error messages
    } else {
      setError("Project not found"); // Set error message if not found
    }
  };

  // Filtered projects based on search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App" style={{ textAlign: "center", padding: "20px" }}>
      <h2>PROJECTS</h2>

      {/* Scrollable Project List */}
      <div style={{ border: "1px solid #007AFF", padding: "10px", maxHeight: "200px", overflowY: "scroll" }}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            style={{
              borderBottom: "1px dashed #007AFF",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 0"
            }}
          >
            <span>{project.title}</span>
            <button onClick={() => deleteProject(project.id)}>
              <FontAwesomeIcon icon={faTrash} style={{ color: 'white' }} />
            </button>
            <button onClick={() => openProject(project.id)}>
              <FontAwesomeIcon icon={faRightToBracket} style={{ color: 'white' }} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        
        {/* Search Input */}
        <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search projects"
        style={{
          padding: "5px",
          marginBottom: "10px"
        }}
        />
         <button onClick={addProject}>+</button>
         <button onClick={deleteByTitle} id="deleteByTitle-button">-</button>
     </div>
        

      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
    </div>
  );
}

export default App;
