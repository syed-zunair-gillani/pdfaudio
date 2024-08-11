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

    return (
        <div>
            <h2>PDF Text Extractor</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <h3>Extracted Text:</h3>
                <pre>{pdfText}</pre>
            </div>
        </div>
    );
};

export default PdfTextExtractor;
