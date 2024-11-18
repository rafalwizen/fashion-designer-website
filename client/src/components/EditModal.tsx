import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface EditModalProps {
    project: {
        id: number;
        name: string;
        description: string;
        price: number;
        imageIds: number[];
    };
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
}

const EditModal: React.FC<EditModalProps> = ({ project, onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [name, setName] = useState(project.name);
    const [description, setDescription] = useState(project.description);
    const [price, setPrice] = useState(project.price.toString());
    const [newImages, setNewImages] = useState<File[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

    useEffect(() => {
        return () => {
            newImagePreviews.forEach(URL.revokeObjectURL);
        };
    }, [newImagePreviews]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('deletedImageIds', JSON.stringify(deletedImageIds));
        newImages.forEach(image => formData.append('newImages', image));
        onSubmit(formData);
    };

    const handleImageDelete = (imageId: number) => {
        setDeletedImageIds(prev => [...prev, imageId]);
    };

    const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const addedImages = Array.from(e.target.files);
            setNewImages(prev => [...prev, ...addedImages]);

            const newPreviews = addedImages.map(file => URL.createObjectURL(file));
            setNewImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeNewImage = (index: number) => {
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewImagePreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full my-8">
                <h2 className="text-2xl font-bold mb-4">{t('editProject')}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            {t('projectName')}
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            {t('projectDescription')}
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            rows={3}
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                            {t('projectPrice')}
                        </label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('currentImages')}
                        </label>
                        <div className="grid grid-cols-3 gap-4">
                            {project.imageIds.map((imageId) => (
                                <div key={imageId} className="relative">
                                    <img
                                        src={`http://localhost:5000/images/${imageId}`}
                                        alt={`Project image ${imageId}`}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    {!deletedImageIds.includes(imageId) && (
                                        <button
                                            type="button"
                                            onClick={() => handleImageDelete(imageId)}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            X
                                        </button>
                                    )}
                                    {deletedImageIds.includes(imageId) && (
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                            <span className="text-white">{t('markedForDeletion')}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newImages" className="block text-sm font-medium text-gray-700">
                            {t('addNewImages')}
                        </label>
                        <input
                            type="file"
                            id="newImages"
                            onChange={handleNewImages}
                            className="mt-1 block w-full"
                            multiple
                            accept="image/*"
                        />
                    </div>
                    {newImagePreviews.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('newImagePreviews')}
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {newImagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`New image preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('save')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditModal;