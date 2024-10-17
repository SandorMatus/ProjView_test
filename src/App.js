import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { collection, addDoc, getDocs, deleteDoc, doc,updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './Project.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBriefcase, faCode, faTrash, faFileCirclePlus, faCheck, faXmark, faPen, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ProjectDetails from "./ProjectDetails";
import Header from './Header'; 
import AddProjectModal from "./AddProjectModal"; 

function App() {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const navigate = useNavigate(); // Hook to programmatically navigate

  // State for selected category and status
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [projectDetailsModalOpen, setProjectDetailsModalOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

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

  // Function to refresh the project list
  const refreshProjects = async () => {
    const projectCollection = collection(db, "projects");
    const projectSnapshot = await getDocs(projectCollection);
    const projectList = projectSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));
    setProjects(projectList);
  };

// Function to open the project details modal
const openProjectDetailsModal = (id) => {
  setCurrentProjectId(id);
  setProjectDetailsModalOpen(true);
};

  // Deleting a project by ID
  const deleteProject = async (id) => {
    await deleteDoc(doc(db, "projects", id));
    setProjects(projects.filter(project => project.id !== id)); // Update projects state
  };

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = async () => {
    await refreshProjects(); // Refresh the project list
    setIsModalOpen(false);
  };

// Adding a project
const addProject = async (projectData) => {
  const createdAt = new Date();
  const docRef = await addDoc(collection(db, "projects"), {
      title: projectData.name, // Ensure this is set
      type: projectData.type,
      lead: projectData.lead,
      category: projectData.category,
      url: projectData.url || null,
      createdAt: createdAt,
      status: projectData.status || "active"
  });

  // Immediately update the local state with the new project
  setProjects(prevProjects => [
      ...prevProjects,
      { id: docRef.id, ...projectData, createdAt, status: projectData.status || "active" }
  ]);
};

  // Filtered projects based on search term, selected category, and selected status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title && project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || project.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesStatus = selectedStatus === "all" || project.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Function to generate the header text based on selected category and status
  const getHeaderText = () => {
    let headerText = "All project types";
    
    if (selectedCategory !== "all") {
      headerText = selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);
    }

    if (selectedStatus !== "all") {
      headerText += ` - ${selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}`;
    }

    return headerText;
  };

  const changeProjectStatus = async (projectId, newStatus) => {
    const projectRef = doc(db, "projects", projectId);
    await updateDoc(projectRef, { status: newStatus }); // Update the project's status in Firestore
    // Update the local state
    setProjects(projects.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
  };
  
  // Pass this function to the ProjectDetails component
  {projectDetailsModalOpen && (
      <ProjectDetails 
        projectId={currentProjectId} 
        onClose={() => {
          setProjectDetailsModalOpen(false); 
          refreshProjects(); // Refresh the project list on close
        }} 
        refreshProjects={refreshProjects} // Pass refresh function
      />
  )}
  
  return (
    <div className="App" style={{ textAlign: "left" }}>
      <Header /> {/* Assuming you have a Header component */}

      <div className="aui-page-header">
        <div className="aui-page-header-inner">
          <h1>Browse projects</h1>
        </div>
      </div>
      <div className="main-container">
        {/* Sidebar */}
        <aside>
          <div className="filter-section">
            <h4>Project Categories</h4>
            <ul className="filterUl">
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedCategory("all")} 
                  className={selectedCategory === "all" ? "active" : ""}
                >
                  All project types
                </a>
              </li>
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedCategory("code")} 
                  className={selectedCategory === "code" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faCode} /> Code
                </a>
              </li>
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedCategory("business")} 
                  className={selectedCategory === "business" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faBriefcase} /> Business
                </a>
              </li>
            </ul>
          </div>
          <div className="filter-section">
            <h4>Statuses</h4>
            <ul className="filterUl"> 
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedStatus("all")} 
                  className={selectedStatus === "all" ? "active" : ""}
                >
                  All statuses
                </a>
              </li>
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedStatus("active")} 
                  className={selectedStatus === "active" ? "active" : ""}
                >
                  Active
                </a>
              </li>
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedStatus("inactive")} 
                  className={selectedStatus === "inactive" ? "active" : ""}
                >
                  Inactive
                </a>
              </li>
              <li className="filterIl">
                <a 
                  href="#" 
                  onClick={() => setSelectedStatus("custom")} 
                  className={selectedStatus === "custom" ? "active" : ""}
                >
                  Custom
                </a>
              </li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main>
          <div className="project-list-header">
            <h2>{getHeaderText()}</h2> {/* Updated header text based on selections */}
            <input
              id="search-bar"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects..."
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Key</th>
                <th>Status</th>
                <th>Project lead</th>
                <th>Project category</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id}>
                <td>
                    <a 
                        href="#" 
                        onClick={(e) => {
                            e.preventDefault(); // Prevent default anchor behavior
                            openProjectDetailsModal(project.id); // Open the project details modal
                        }} 
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        {project.title}
                    </a>
                </td>
                  <td>{project.id}</td>
                  <td>           
                    {project.status.toLowerCase() === "active" && <FontAwesomeIcon icon={faCheck} />}
                    {project.status.toLowerCase() === "inactive" && <FontAwesomeIcon icon={faXmark} />}
                    {project.status.toLowerCase() === "custom" && <FontAwesomeIcon icon={faPen} />}</td>
                  <td>{project.lead}</td>
                  <td>
                    {project.category === "Code" && <FontAwesomeIcon icon={faCode} />}
                    {project.category === "Business" && <FontAwesomeIcon icon={faBriefcase} />}
                    {project.category === "Other" && <FontAwesomeIcon icon={faQuestionCircle} />}
                  </td>
                  <td>{project.url || 'No URL'}</td>
                  <td>
                    <FontAwesomeIcon icon={faTrash} onClick={() => deleteProject(project.id)} style={{ cursor: 'pointer', color: 'red' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: "20px" }}>
            <button onClick={openModal} className="add-project-btn">
              <FontAwesomeIcon icon={faFileCirclePlus} style={{ color: 'white' }} />
            </button>

            <AddProjectModal
              isOpen={isModalOpen}
              onClose={closeModal}
              onAddProject={addProject}
            />
          </div>
        </main>
      </div>

      {projectDetailsModalOpen && (
                <ProjectDetails 
                    projectId={currentProjectId} 
                    onClose={() => setProjectDetailsModalOpen(false)} 
                    refreshProjects={refreshProjects} // Pass the function as a prop
                />
            )}
    </div>
  );
}

export default App;
