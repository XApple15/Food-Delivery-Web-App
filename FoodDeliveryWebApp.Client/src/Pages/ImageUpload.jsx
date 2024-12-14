import React, { useState } from 'react';
import axios from 'axios';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileDescription, setFileDescription] = useState('');
    const [uploadStatus, setUploadStatus] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();

        // Validate input fields
        if (!file) {
            setUploadStatus('Please select a file.');
            return;
        }
        if (!fileName.trim()) {
            setUploadStatus('File name is required.');
            return;
        }

        const formData = new FormData();
        formData.append('File', file); // Matches "File" in the DTO
        formData.append('FileName', fileName); // Matches "FileName" in the DTO
        formData.append('FileDescription', fileDescription); // Matches "FileDescription" in the DTO

        try {
            const response = await axios.post('https://localhost:7131/api/images/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setUploadStatus(`Upload successful! File ID: ${response.data.id}`);
        } catch (error) {
            setUploadStatus(`Upload failed: ${error.response?.data?.file || error.message}`);
        }
    };

    return (
        <div style={{ margin: '50px auto', maxWidth: '500px', textAlign: 'center' }}>
            <h2>Upload an Image</h2>
            <form onSubmit={handleUpload}>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="file">Select File:</label>
                    <input
                        id="file"
                        type="file"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.gif"
                        style={{ display: 'block', margin: '10px auto' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="fileName">File Name:</label>
                    <input
                        id="fileName"
                        type="text"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="Enter file name"
                        style={{ width: '100%', padding: '10px' }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label htmlFor="fileDescription">File Description:</label>
                    <textarea
                        id="fileDescription"
                        value={fileDescription}
                        onChange={(e) => setFileDescription(e.target.value)}
                        placeholder="Enter file description (optional)"
                        style={{ width: '100%', padding: '10px' }}
                        rows="4"
                    />
                </div>
                <button type="submit" style={{ padding: '10px 20px', fontSize: '16px' }}>
                    Upload
                </button>
            </form>
            {uploadStatus && <p style={{ marginTop: '20px' }}>{uploadStatus}</p>}
        </div>
    );
};

export default ImageUpload;
