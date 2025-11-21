import { useState } from 'react';

export default function BasicConfig({ initialData, onNext }) {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        image: initialData?.image || null,
        numberPrice: initialData?.numberPrice || '',
        totalNumbers: initialData?.totalNumbers || 100
    });

    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(initialData?.image || null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image: reader.result });
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData({ ...formData, image: null });
        setImagePreview(null);
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name || formData.name.trim().length < 3) {
            newErrors.name = 'El nombre debe tener al menos 3 caracteres';
        }

        if (!formData.numberPrice || formData.numberPrice <= 0) {
            newErrors.numberPrice = 'El precio debe ser mayor a 0';
        }

        if (!formData.totalNumbers || formData.totalNumbers < 10 || formData.totalNumbers > 1000) {
            newErrors.totalNumbers = 'La cantidad debe estar entre 10 y 1000';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onNext(formData);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    🐾 Configuración de la Rifa
                </h2>
                <p className="text-gray-600">Paso 1 de 2: Información Básica</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nombre de la Rifa */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-tag mr-2 text-orange-600"></i>Nombre de la Rifa *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej: Rifa para Sofia"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.name ? 'border-red-500' : 'border-gray-200'
                            } focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Imagen */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-image mr-2 text-orange-600"></i>Imagen de la Mascota
                    </label>
                    {!imagePreview ? (
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="raffleImage"
                            />
                            <label
                                htmlFor="raffleImage"
                                className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition"
                            >
                                <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-3"></i>
                                <p className="text-sm text-gray-500">Click para subir imagen</p>
                            </label>
                        </div>
                    ) : (
                        <div className="relative">
                            <img src={imagePreview} alt="Preview" className="w-full h-48 object-contain rounded-xl bg-gray-50" />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    )}
                </div>

                {/* Precio */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-dollar-sign mr-2 text-orange-600"></i>Valor del Número *
                    </label>
                    <input
                        type="number"
                        value={formData.numberPrice}
                        onChange={(e) => setFormData({ ...formData, numberPrice: parseFloat(e.target.value) || '' })}
                        placeholder="Ej: 2000"
                        min="1"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.numberPrice ? 'border-red-500' : 'border-gray-200'
                            } focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none`}
                    />
                    {errors.numberPrice && <p className="text-red-500 text-sm mt-1">{errors.numberPrice}</p>}
                </div>

                {/* Cantidad de Números */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <i className="fas fa-hashtag mr-2 text-orange-600"></i>Cantidad de Números *
                    </label>
                    <input
                        type="number"
                        value={formData.totalNumbers}
                        onChange={(e) => setFormData({ ...formData, totalNumbers: parseInt(e.target.value) || '' })}
                        placeholder="Ej: 100"
                        min="10"
                        max="1000"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${errors.totalNumbers ? 'border-red-500' : 'border-gray-200'
                            } focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition outline-none`}
                    />
                    <p className="text-xs text-gray-500 mt-1">Entre 10 y 1000 números</p>
                    {errors.totalNumbers && <p className="text-red-500 text-sm mt-1">{errors.totalNumbers}</p>}
                </div>

                {/* Botón Siguiente */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition transform hover:-translate-y-0.5"
                >
                    Siguiente
                    <i className="fas fa-arrow-right"></i>
                </button>
            </form>
        </div>
    );
}
