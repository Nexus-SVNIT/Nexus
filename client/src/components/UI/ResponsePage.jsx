import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ResponseTable from './ResponseTable';

const FormsDropdown = () => {
    const [forms, setForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchForms = async () => {
            const token = localStorage.getItem('core-token');
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/forms/all`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setForms(response.data);
            } catch (err) {
                setError('Failed to fetch forms. Please try again later.');
            }
        };
        fetchForms();
    }, []);

    const handleSelectChange = (e) => {
        const selectedId = e.target.value;
        const form = forms.find(f => f._id === selectedId);
        setSelectedForm(form);
    };

    return (
        <div className="bg-gray-900 w-full flex items-center justify-center p-4">
            <div className="w-full bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Select a Form</h2>
                {error && <p className="text-red-500">{error}</p>}

                <select
                    onChange={handleSelectChange}
                    className="w-full text-black bg-gray-700 p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    defaultValue=""
                    style={{ WebkitAppearance: 'none', appearance: 'none' }}
                >
                    <option value="" disabled className="bg-gray-800">
                        Select a form
                    </option>
                    {forms.map((form) => (
                        <option key={form._id} value={form._id} className="bg-gray-800 text-gray-200">
                            {form.name}
                        </option>
                    ))}
                </select>

                {selectedForm && (
                    <>
                        <div className="mt-6 p-4 bg-gray-700 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-100 mb-2">{selectedForm.name}</h3>
                            <p className="text-gray-300"><strong>Deadline:</strong> {selectedForm.deadline}</p>
                            <p className="text-gray-300"><strong>Published:</strong> {selectedForm.publish ? 'Yes' : 'No'}</p>
                            <p className="text-gray-300"><strong>Response Count:</strong> {selectedForm.responseCount}</p>
                        </div>
                        <ResponseTable id={selectedForm._id} />
                    </>
                )}
            </div>
        </div>
    );
};

export default FormsDropdown;
