"use client"

import React, { useState } from 'react';
import pdfToText from "react-pdftotext";

const PdfTextExtractor = () => {
    const [pdfText, setPdfText] = useState('');
    const [error, setError] = useState(null);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        pdfToText(file)
        .then((text) => setPdfText(text))
        .catch((error) => console.error("Failed to extract text from pdf"));
    };

    const convertTextToAudio = () => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(pdfText);
            speechSynthesis.speak(utterance);
        } else {
            alert('Your browser does not support text-to-speech.');
        }
    };

    return (
        <div>
            <h2>PDF Text Extractor</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <h3>Extracted Text:</h3>
                <p className='p-4'>{pdfText}</p>
            </div>
            <hr/>
            <button onClick={convertTextToAudio} disabled={!pdfText}>
                    Convert to Audio
                </button>
        </div>
    );
};

export default PdfTextExtractor;
