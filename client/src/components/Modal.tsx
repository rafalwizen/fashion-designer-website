import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
    onClose: () => void;
    onSubmit: (name: string, description: string, images: File[], price: number) => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [price, setPrice] = useState('');
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, description, images, parseFloat(price));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newImages = Array.from(e.target.files);
            setImages(prevImages => [...prevImages, ...newImages]);

            const newPreviews = newImages.map(file => URL.createObjectURL(file));
            setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
            <div className="bg-white p-8 rounded-lg max-w-2xl w-full my-8">
                <h2 className="text-2xl font-bold mb-4">{t('addProject')}</h2>
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
                        <label htmlFor="images" className="block text-sm font-medium text-gray-700">
                            {t('projectImages')}
                        </label>
                        <input
                            type="file"
                            id="images"
                            onChange={handleFileChange}
                            className="mt-1 block w-full"
                            multiple
                            accept="image/*"
                            required
                        />
                    </div>
                    {imagePreviews.length > 0 && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('imagePreviews')}
                            </label>
                            <div className="grid grid-cols-3 gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
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
                            {t('submit')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;