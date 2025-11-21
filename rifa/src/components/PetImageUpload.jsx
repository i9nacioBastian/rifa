import { useState } from 'react';

export default function PetImageUpload({ petImage, onImageChange }) {
    const [preview, setPreview] = useState(petImage || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onImageChange(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setPreview(null);
        onImageChange(null);
    };

    return (
        <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                <i className="fas fa-image mr-2 text-orange-600"></i>Imagen de la Mascota
            </label>

            {!preview ? (
                <div className="relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="petImageInput"
                    />
                    <label
                        htmlFor="petImageInput"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition"
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">Click para subir</span> o arrastra y suelta
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG o JPEG</p>
                        </div>
                    </label>
                </div>
            ) : (
                <div className="relative">
                    <img
                        src={preview}
                        alt="Mascota"
                        className="w-full h-48 object-cover rounded-xl"
                    />
                    <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            )}
        </div>
    );
}
