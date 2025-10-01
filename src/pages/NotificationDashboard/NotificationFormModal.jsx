import React, { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";

/**
 * A modal form for creating and scheduling notifications.
 * It appears as a floating panel over the existing page content.
 *
 * @param {object} props - The component's props.
 * @param {boolean} props.isOpen - Controls whether the modal is visible.
 * @param {function} props.onClose - Function to call when the modal should be closed.
 * @param {function} props.onAddCampaign - Callback function to submit the new campaign data to the parent.
 */
const NotificationFormModal = ({ isOpen, onClose, onAddCampaign }) => {
    // State for standard form fields
    const [formData, setFormData] = useState({ title: "", link: "", body: "", imageFile: null });
    const [imagePreview, setImagePreview] = useState(null);

    // State for scheduling logic
    const [scheduleType, setScheduleType] = useState("Send Now");
    const [scheduledDates, setScheduledDates] = useState([""]);
    const [recurringData, setRecurringData] = useState({ value: 1, unit: 'Days' });

    // Effect to clear the form when the modal is closed and re-opened
    useEffect(() => {
        if (isOpen) {
            handleClear();
        }
    }, [isOpen]);

    // Resets all form fields to their initial state
    const handleClear = () => {
        setFormData({ title: "", link: "", body: "", imageFile: null });
        setImagePreview(null);
        setScheduleType("Send Now");
        setScheduledDates([""]);
        setRecurringData({ value: 1, unit: 'Days' });
        const fileInput = document.getElementById("dropzone-file-modal");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    // Validates and submits the form data to the parent component
    const handleSubmit = () => {
        if (!formData.title || !formData.body) {
            alert("Notification Heading and Body are required.");
            return;
        }
        // Consolidate all relevant state and pass it up
        onAddCampaign({
            ...formData,
            imagePreview,
            scheduleType,
            scheduledDates,
            recurringData
        });
    };

    // Handles changes for text inputs and textareas
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handles the file input for image uploads and creates a preview URL
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, imageFile: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // --- Handlers for the dynamic scheduled dates list ---
    const handleDateChange = (e, index) => {
        const updatedDates = [...scheduledDates];
        updatedDates[index] = e.target.value;
        setScheduledDates(updatedDates);
    };

    const addDateField = () => {
        setScheduledDates([...scheduledDates, ""]);
    };

    const removeDateField = (index) => {
        if (scheduledDates.length > 1) {
            setScheduledDates(scheduledDates.filter((_, i) => i !== index));
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        // Root container with a semi-transparent black background
        <div className="absolute inset-0 flex justify-center items-center z-50 p-4 bg-black/50">
            {/* Modal Panel with shadow and border */}
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-300">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-4">
                    <h2 className="text-xl font-bold text-gray-800">Create Notification</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 overflow-y-auto flex-grow">
                    {/* Image Uploader */}
                    <div className="flex items-center justify-center w-full mb-6">
                        <label htmlFor="dropzone-file-modal" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 relative">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg p-2" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span></p>
                                </div>
                            )}
                            <input id="dropzone-file-modal" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Notification Heading</label>
                            <input type="text" name="title" value={formData.title} onChange={handleFormChange} placeholder="e.g. All India Challenge" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Notification Link</label>
                            <input type="text" name="link" value={formData.link} onChange={handleFormChange} placeholder="e.g. https://xyzshare.com/" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Notification Body</label>
                            <textarea name="body" value={formData.body} onChange={handleFormChange} placeholder="All India CA Foundation Dec '22..." rows="4" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"/>
                        </div>
                    </div>

                    {/* Schedule Type Selector */}
                    <div className="mt-6">
                        <label className="text-sm font-medium text-gray-700">Schedule Type</label>
                        <div className="flex space-x-4 mt-2">
                            {['Send Now', 'Scheduled', 'Recurring'].map(type => (
                                <button key={type} onClick={() => setScheduleType(type)} className={`px-4 py-2 rounded-lg text-sm border ${scheduleType === type ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conditional Fields for 'Scheduled' */}
                    {scheduleType === 'Scheduled' && (
                        <div className="mt-4 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Scheduled Pushes</label>
                            {scheduledDates.map((date, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="datetime-local" value={date} onChange={(e) => handleDateChange(e, index)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                                    {scheduledDates.length > 1 &&
                                        <button onClick={() => removeDateField(index)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100">
                                            <X size={16} />
                                        </button>
                                    }
                                </div>
                            ))}
                            <button onClick={addDateField} className="text-sm text-blue-600 hover:underline font-medium">+ Add Another Date</button>
                        </div>
                    )}

                    {/* Conditional Fields for 'Recurring' */}
                    {scheduleType === 'Recurring' && (
                        <div className="mt-4">
                            <label className="text-sm font-medium text-gray-700">Send push notifications every</label>
                            <div className="flex items-center space-x-2 mt-1">
                                <input type="number" min="1" value={recurringData.value} onChange={(e) => setRecurringData(p => ({...p, value: e.target.value}))} className="w-20 border border-gray-300 rounded-lg px-3 py-2 text-sm"/>
                                <select value={recurringData.unit} onChange={(e) => setRecurringData(p => ({...p, unit: e.target.value}))} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                                    <option>Days</option>
                                    <option>Weeks</option>
                                    <option>Months</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="flex items-center space-x-3 p-4  mt-auto">
                    <button onClick={onClose} className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">Cancel</button>
                    <button onClick={handleSubmit} className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">Add Campaign</button>
                </div>
            </div>
        </div>
    );
};

export default NotificationFormModal;

