import React, { useState } from 'react';

function CreatePanelForm() {
    const [formId, setFormId] = useState('');
    const [panels, setPanels] = useState([
        {
            panelNumber: '',
            interviewers: '',
            candidatesPerPanel: 5,
            startTime: '',
            interviewDuration: '',
            panelLink: '',
        }
    ]);

    const handlePanelChange = (index, event) => {
        const newPanels = [...panels];
        newPanels[index][event.target.name] = event.target.value;
        setPanels(newPanels);
    };

    const handleAddPanel = () => {
        setPanels([
            ...panels,
            {
                panelNumber: '',
                interviewers: '',
                candidatesPerPanel: 5,
                startTime: '',
                interviewDuration: '',
                panelLink: '',
            }
        ]);
    };

    const calculateInterviewTimes = (startTime, duration, candidatesCount) => {
        let times = [];
        let currentTime = new Date(startTime);
        for (let i = 0; i < candidatesCount; i++) {
            times.push(new Date(currentTime));
            currentTime.setMinutes(currentTime.getMinutes() + parseInt(duration, 10));
        }
        return times;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        // Prepare panels data for submission
        const formattedPanels = panels.map(panel => {
            const interviewTimes = calculateInterviewTimes(panel.startTime, panel.interviewDuration, panel.candidatesPerPanel);
            return {
                panelNumber: panel.panelNumber,
                interviewers: panel.interviewers.split(';').map(i => {
                    const [name, email] = i.split(',');
                    return { name, email };
                }),
                candidatesPerPanel: panel.candidatesPerPanel,
                startTime: panel.startTime,
                interviewDuration: panel.interviewDuration,
                panelLink: panel.panelLink,
                interviewTimes,
            };
        });

        // Send the data to the backend
        await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/Panel/create-panels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                formId,
                panels: formattedPanels,
            }),
        });

        alert('Panels created and emails sent successfully!');
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Create Interview Panels</h2>
            <div className='mb-4'>
                <input 
                    type="text" 
                    name="formId" 
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="Form ID"
                    className="w-full p-2 border border-gray-300 rounded"
                />
            </div>
            {panels.map((panel, index) => (
                <div key={index} className="mb-4">
                    <input
                        type="text"
                        name="panelNumber"
                        value={panel.panelNumber}
                        placeholder="Panel Number"
                        onChange={event => handlePanelChange(index, event)}
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        name="interviewers"
                        value={panel.interviewers}
                        placeholder="Interviewers (format: Name,Email;Name,Email)"
                        onChange={event => handlePanelChange(index, event)}
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        name="candidatesPerPanel"
                        value={panel.candidatesPerPanel}
                        placeholder="Number of Candidates per Panel"
                        onChange={event => handlePanelChange(index, event)}
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                    <input
                        type="datetime-local"
                        name="startTime"
                        value={panel.startTime}
                        placeholder="Start Time"
                        onChange={event => handlePanelChange(index, event)}
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                    <input
                        type="number"
                        name="interviewDuration"
                        value={panel.interviewDuration}
                        placeholder="Interview Duration per Candidate (in minutes)"
                        onChange={event => handlePanelChange(index, event)}
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        name="panelLink"
                        value={panel.panelLink}
                        placeholder="Panel Link (e.g., https://calendly.com/panel1)"
                        onChange={event => handlePanelChange(index, event)}
                        className="w-full p-2 mb-2 border border-gray-300 rounded"
                    />
                </div>
            ))}
            <button
                type="button"
                onClick={handleAddPanel}
                className="w-full p-2 mb-4 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Add Panel
            </button>
            <button
                type="submit"
                className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Create Panels
            </button>
        </form>
    );
}

export default CreatePanelForm;
