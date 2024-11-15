import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
    onClose: () => void;
    onSubmit: (name: string, description: string, images: File[]) => void;
}

const Modal: React.FC<ModalProps> = ({ onClose, onSubmit }) => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, description, images);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg max-w-md w-full">
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