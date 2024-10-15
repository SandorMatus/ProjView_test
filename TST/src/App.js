import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import './App.css'; // Importing the CSS file

function App() {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
            const projectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProjects(projectList);
        });
        return () => unsubscribe();
    }, []);

    const addProject = async () => {
        if (projectName.trim() === "") return;
        await addDoc(collection(db, "projects"), { name: projectName });
        setProjectName('');
    };

    const deleteProject = async (id) => {
        await deleteDoc(doc(db, "projects", id));
    };

    return (
        <div>
            <h1>Project Manager</h1>
            <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Project Name"
            />
            <button onClick={addProject}>Add Project</button>
            <div className="project-container">
                {projects.map(project => (
                    <div className="project-card" key={project.id}>
                        <div className="delete-button" onClick={() => deleteProject(project.id)}>X</div>
                        <h3>{project.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
