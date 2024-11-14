import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Project {
    id: number;
    name: string;
    description: string;
    images: string[];
}

interface PortfolioProps {
    isAdmin: boolean;
}

const Portfolio: React.FC<PortfolioProps> = ({ isAdmin }) => {
    const { t } = useTranslation();
    const [projects] = useState<Project[]>([
        {
            id: 1,
            name: 'Eco-friendly Summer Dress',
            description: 'A lightweight dress made from recycled materials, perfect for hot summer days.',
            images: ['/path-to-image1.jpg', '/path-to-image2.jpg', '/path-to-image3.jpg'],
        },
        {
            id: 2,
            name: 'Upcycled Denim Jacket',
            description: 'A unique jacket created from old jeans, showcasing sustainable fashion at its best.',
            images: ['/path-to-image4.jpg', '/path-to-image5.jpg', '/path-to-image6.jpg'],
        },
    ]);

    const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});

    const nextImage = (projectId: number) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [projectId]: (prev[projectId] + 1) % projects.find(p => p.id === projectId)!.images.length,
        }));
    };

    const prevImage = (projectId: number) => {
        setCurrentImageIndex(prev => ({
            ...prev,
            [projectId]: (prev[projectId] - 1 + projects.find(p => p.id === projectId)!.images.length) % projects.find(p => p.id === projectId)!.images.length,
        }));
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-dark-navy mb-8">{t('portfolio')}</h2>
            {projects.map(project => (
                <div key={project.id} className="bg-white p-8 rounded-lg shadow-md mb-8">
                    <h3 className="text-2xl font-bold text-dark-navy mb-4">{project.name}</h3>
                    <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/2 relative">
                            <img
                                src={project.images[currentImageIndex[project.id] || 0]}
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
                            <p className="text-lg text-dark-navy">{project.description}</p>
                        </div>
                    </div>
                </div>
            ))}
            {isAdmin && (
                <button className="bg-powder-pink text-dark-navy px-4 py-2 rounded mt-4">
                    {t('addProject')}
                </button>
            )}
        </div>
    );
};

export default Portfolio;