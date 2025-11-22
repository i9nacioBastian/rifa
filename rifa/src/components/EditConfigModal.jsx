import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { themes } from '../config/themes';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';

export default function EditConfigModal({ isOpen, onClose, config, onSave, soldNumbers = {} }) {
    const { changeTheme } = useTheme();
    const [formData, setFormData] = useState({
        name: config?.name || '',
        image: config?.image || null,
        numberPrice: config?.numberPrice || '',
        totalNumbers: config?.totalNumbers || 100,
        theme: config?.theme || 'normal'
    });
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(config?.image || null);

    // Calculate min numbers based on sales
    const soldNumbersList = Object.keys(soldNumbers).map(Number);
    const hasSales = soldNumbersList.length > 0;
    const maxSoldNumber = hasSales ? Math.max(...soldNumbersList) : 0;
    const minAllowedNumbers = hasSales ? maxSoldNumber : 10;

    // Update form data when config changes
    useEffect(() => {
        if (config) {
            setFormData({
                name: config.name || '',
                image: config.image || null,
                numberPrice: config.numberPrice || '',
                totalNumbers: config.totalNumbers || 100,
                theme: config.theme || 'normal'
            });
            setImagePreview(config.image || null);
        }
    }, [config, isOpen]);

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

        if (!formData.totalNumbers || formData.totalNumbers < minAllowedNumbers || formData.totalNumbers > 1000) {
            if (hasSales) {
                newErrors.totalNumbers = `Debe ser al menos ${minAllowedNumbers} (número vendido más alto) y máximo 1000`;
            } else {
                newErrors.totalNumbers = 'La cantidad debe estar entre 10 y 1000';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validate()) {
            // Apply theme immediately
            if (formData.theme) {
                changeTheme(formData.theme);
            }

            onSave(formData);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalHeader onClose={onClose}>
                <i className="fas fa-edit mr-2"></i>Editar Configuración de Rifa
            </ModalHeader>
            <ModalBody>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Nombre de la Rifa */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-tag mr-2 text-blue-600"></i>Nombre de la Rifa *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Ej: Rifa para Sofia"
                            className={`w-full px-4 py-2 rounded-lg border-2 ${
                                errors.name ? 'border-red-500' : 'border-gray-200'
                            } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-image mr-2 text-blue-600"></i>Imagen de la Mascota
                        </label>
                        {!imagePreview ? (
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="editRaffleImage"
                                />
                                <label
                                    htmlFor="editRaffleImage"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
                                >
                                    <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                    <p className="text-xs text-gray-500">Click para subir imagen</p>
                                </label>
                            </div>
                        ) : (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-32 object-contain rounded-lg bg-gray-50"
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg transition"
                                >
                                    <i className="fas fa-times text-xs"></i>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Precio */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-dollar-sign mr-2 text-blue-600"></i>Valor del Número *
                        </label>
                        <input
                            type="number"
                            value={formData.numberPrice}
                            onChange={(e) =>
                                setFormData({ ...formData, numberPrice: parseFloat(e.target.value) || '' })
                            }
                            placeholder="Ej: 2000"
                            min="1"
                            className={`w-full px-4 py-2 rounded-lg border-2 ${
                                errors.numberPrice ? 'border-red-500' : 'border-gray-200'
                            } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none`}
                        />
                        {errors.numberPrice && (
                            <p className="text-red-500 text-sm mt-1">{errors.numberPrice}</p>
                        )}
                    </div>

                    {/* Cantidad de Números */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <i className="fas fa-hashtag mr-2 text-blue-600"></i>Cantidad de Números *
                        </label>
                        <input
                            type="number"
                            value={formData.totalNumbers}
                            onChange={(e) =>
                                setFormData({ ...formData, totalNumbers: parseInt(e.target.value) || '' })
                            }
                            placeholder="Ej: 100"
                            min={minAllowedNumbers}
                            max="1000"
                            className={`w-full px-4 py-2 rounded-lg border-2 ${
                                errors.totalNumbers ? 'border-red-500' : 'border-gray-200'
                            } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none`}
                        />
                        {hasSales ? (
                            <p className="text-xs text-orange-600 mt-1">
                                <i className="fas fa-exclamation-triangle mr-1"></i>
                                Mínimo {minAllowedNumbers} (hay ventas hasta ese número)
                            </p>
                        ) : (
                            <p className="text-xs text-gray-500 mt-1">Entre 10 y 1000 números</p>
                        )}
                        {errors.totalNumbers && (
                            <p className="text-red-500 text-sm mt-1">{errors.totalNumbers}</p>
                        )}
                    </div>

                    {/* Selector de Tema */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                            <i className="fas fa-palette mr-2 text-blue-600"></i>Tema de Colores
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(themes).map(([key, themeData]) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, theme: key })}
                                    className={`p-3 rounded-lg border-2 transition transform hover:scale-105 ${
                                        formData.theme === key
                                            ? 'border-blue-500 bg-blue-50 shadow-lg'
                                            : 'border-gray-200 hover:border-blue-300'
                                    }`}
                                >
                                    <div className="text-center">
                                        <div className="text-2xl mb-1">{themeData.icon}</div>
                                        <div
                                            className={`h-2 rounded-full bg-gradient-to-r ${themeData.colors.primary.start} ${themeData.colors.primary.end} mb-1`}
                                        ></div>
                                        <p className="text-xs font-semibold text-gray-700">
                                            {themeData.name}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                        <p className="text-xs text-gray-700">
                            <i className="fas fa-info-circle text-yellow-600 mr-2"></i>
                            <strong>Nota:</strong> Los cambios se aplicarán inmediatamente. El tema se verá
                            reflejado en toda la aplicación.
                        </p>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                    <i className="fas fa-save mr-2"></i>Guardar Cambios
                </button>
            </ModalFooter>
        </Modal>
    );
}
