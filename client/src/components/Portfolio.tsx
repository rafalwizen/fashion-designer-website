import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import EditModal from './EditModal';
import { useCart } from '../contexts/CartContext';

interface Project {
    id: number;
    name: string;
    description: string;
    imageIds: number[];
    price: number;
}

interface PortfolioProps {
    isAdmin: boolean;
}

const Portfolio: React.FC<PortfolioProps> = ({ isAdmin }) => {
    const { t } = useTranslation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:5000/projects');
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                console.error('Failed to fetch projects');
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const nextImage = (projectId: number) => {
        setCurrentImageIndex(prev => {
            const project = projects.find(p => p.id === projectId);
            if (!project) return prev;
            const currentIndex = prev[projectId] || 0;
            const nextIndex = (currentIndex + 1) % project.imageIds.length;
            return { ...prev, [projectId]: nextIndex };
        });
    };

    const prevImage = (projectId: number) => {
        setCurrentImageIndex(prev => {
            const project = projects.find(p => p.id === projectId);
            if (!project) return prev;
            const currentIndex = prev[projectId] || 0;
            const prevIndex = (currentIndex - 1 + project.imageIds.length) % project.imageIds.length;
            return { ...prev, [projectId]: prevIndex };
        });
    };

    const handleAddProject = async (name: string, description: string, images: File[], price: number) => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price.toString());
        images.forEach(image => formData.append('images', image));

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/projects', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                fetchProjects();
                setIsModalOpen(false);
            } else {
                console.error('Failed to add project');
            }
        } catch (error) {
            console.error('Error adding project:', error);
        }
    };

    const handleEditProject = async (formData: FormData) => {
        if (!editingProject) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/projects/${editingProject.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                fetchProjects();
                setIsEditModalOpen(false);
            } else {
                console.error('Failed to edit project');
            }
        } catch (error) {
            console.error('Error editing project:', error);
        }
    };

    const handleDeleteProject = async (projectId: number) => {
        if (window.confirm(t('confirmDeleteProject'))) {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:5000/projects/${projectId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    fetchProjects();
                } else {
                    console.error('Failed to delete project');
                }
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        }
    };

    const handleAddToCart = (project: Project) => {
        addToCart({
            id: project.id,
            name: project.name,
            price: project.price
        });
    };

    return (
        <div className="relative">
            <h2 className="text-3xl font-bold text-dark-navy mb-8">{t('portfolio')}</h2>
            {isAdmin && (
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="absolute top-0 right-0 bg-powder-pink text-dark-navy px-4 py-2 rounded"
                >
                    {t('addProject')}
                </button>
            )}
            {projects.map(project => (
                <div key={project.id} className="bg-white p-8 rounded-lg shadow-md mb-8 relative">
                    {isAdmin && (
                        <div className="absolute top-2 right-2 flex space-x-2">
                            <button
                                onClick={() => {
                                    setEditingProject(project);
                                    setIsEditModalOpen(true);
                                }}
                                className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                            >
                                {t('editProject')}
                            </button>
                            <button
                                onClick={() => handleDeleteProject(project.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                            >
                                {t('deleteProject')}
                            </button>
                        </div>
                    )}
                    <h3 className="text-2xl font-bold text-dark-navy mb-4">{project.name}</h3>
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 relative">
                            <img
                                src={`http://localhost:5000/images/${project.imageIds[currentImageIndex[project.id] || 0]}`}
                                alt={project.name}
                                className="w-full h-64 object-cover rounded"
                            />
                            <button
                                onClick={() => prevImage(project.id)}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-dark-navy text-white p-2 rounded-l"
                            >
                                &lt;
                            </button>
                            <button
                                onClick={() => nextImage(project.id)}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-dark-navy text-white p-2 rounded-r"
                            >
                                &gt;
                            </button>
                        </div>
                        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
                            <p className="text-lg text-dark-navy mb-4">{project.description}</p>
                            <p className="text-xl font-bold text-dark-navy mb-4">{t('price')}: ${project.price}</p>
                            <button
                                onClick={() => handleAddToCart(project)}
                                className="bg-powder-pink text-dark-navy px-4 py-2 rounded hover:bg-powder-pink-dark"
                            >
                                {t('addToCart')}
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {isModalOpen && (
                <Modal onClose={() => setIsModalOpen(false)} onSubmit={handleAddProject} />
            )}
            {isEditModalOpen && editingProject && (
                <EditModal
                    project={editingProject}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditProject}
                />
            )}
        </div>
    );
};

export default Portfolio;