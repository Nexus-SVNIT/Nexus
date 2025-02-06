import React, { useState } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const token = localStorage.getItem('core-token');

const NotifySubscribers = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_BACKEND_BASE_URL}/api/user/notify-subscribers`,
                    { subject, message },
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );
            
                alert('Notification sent successfully!');
                setSubject('');
                setMessage('');
            } catch (error) {
                console.error(error);
                alert(error.response?.data?.message || 'Error sending notification');
            }
            
    };

    const modules = {
        toolbar: [
            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
            [{size: []}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'align': [] }],  // Add alignment options
            [{'list': 'ordered'}, {'list': 'bullet'}, 
             {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'video'],
            [{ 'color': [] }, { 'background': [] }], // Add color and background options
            ['clean']                                         
        ],
    };

    const formats = [
        'header', 'font', 'size',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent', 'align',  // Add align format
        'link', 'image', 'video',
        'color', 'background' // Add color and background formats
    ];

    const emailTemplate = (message) => `
        <div style="background-color: black; color: white; font-size: 14px; padding: 20px; font-family: Arial, sans-serif;">
            <div style="background-color: #333; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                <img src="https://lh3.googleusercontent.com/d/1GV683lrLV1Rkq5teVd1Ytc53N6szjyiC" style="display: block; margin: auto; max-width: 100%; height: auto;"/>
                <p>
                <h3 style="color: white;">Dear Subscriber,</h3>
                </p>
                <p style="color: #ccc;">${message}</p>
                <p style="color: #ccc;">Visit <a href="https://www.nexus-svnit.in" style="color: #1a73e8;">this link</a> for more details.</p>
                <p>Thanks,<br>Team NEXUS</p>
            </div>
            <div style="margin-top: 20px; text-align: center; color: #888; font-size: 12px;">
                <p>Contact us: <a href="mailto:nexus@coed.svnit.ac.in" style="color: #1a73e8;">nexus@coed.svnit.ac.in</a></p>
                <p>Follow us on <a href="https://www.linkedin.com/company/nexus-svnit/" style="color: #1a73e8;">LinkedIn</a> <a href="https://www.instagram.com/nexus_svnit/" style="color: #1a73e8;">Instagram</a></p>
            </div>
        </div>
    `;

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="bg-slate-800 shadow-lg rounded-lg p-6 w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-center text-white mb-4">Notify Subscribers</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        required
                        className="w-full text-black-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ReactQuill
                        value={message}
                        onChange={setMessage}
                        modules={modules}
                        formats={formats}
                        className="w-full bg-white p-2 rounded-md  min-h-32 h-auto text-black-2"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white font-semibold py-2 rounded-md hover:bg-blue-600 transition duration-200"
                    >
                        Notify Subscribers
                    </button>
                </form>
                <div className="bg-white p-4 mt-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-2">Preview</h3>
                    <div dangerouslySetInnerHTML={{ __html: emailTemplate(message) }} />
                </div>
            </div>
            <style jsx global>{`
                .ql-editor p {
                    color: black;
                }
                
                /* Tooltips for toolbar buttons */
                .ql-bold::before { content: "Bold"; }
                .ql-italic::before { content: "Italic"; }
                .ql-underline::before { content: "Underline"; }
                .ql-strike::before { content: "Strike Through"; }
                .ql-blockquote::before { content: "Blockquote"; }
                .ql-list[value="ordered"]::before { content: "Numbered List"; }
                .ql-list[value="bullet"]::before { content: "Bullet List"; }
                .ql-indent[value="-1"]::before { content: "Decrease Indent"; }
                .ql-indent[value="+1"]::before { content: "Increase Indent"; }
                .ql-link::before { content: "Insert Link"; }
                .ql-image::before { content: "Insert Image"; }
                .ql-video::before { content: "Insert Video"; }
                .ql-clean::before { content: "Clear Formatting"; }
                
                .ql-toolbar button::before {
                    position: absolute;
                    background: #333;
                    color: #fff;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.2s;
                    top: 100%;
                    left: 50%;
                    transform: translateX(-50%);
                    white-space: nowrap;
                    z-index: 10;
                }
                
                .ql-toolbar button:hover::before {
                    opacity: 1;
                }
                
                .ql-toolbar {
                    position: relative;
                }
                
                .ql-toolbar button {
                    position: relative;
                }
            `}</style>
        </div>
    );
};

export default NotifySubscribers;
