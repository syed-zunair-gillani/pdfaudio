"use client"

import React, { useState, useEffect } from 'react';
import pdfToText from "react-pdftotext";

const TextToSpeech = () => {
    const [text, setText] = useState('');
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const synth = window.speechSynthesis;
        const voices = synth.getVoices();
        setVoices(voices);
        setSelectedVoice(voices[0]); // Default to the first available voice

        synth.onvoiceschanged = () => {
            const updatedVoices = synth.getVoices();
            setVoices(updatedVoices);
            setSelectedVoice(updatedVoices[0]); // Update the selected voice to the first available one
        };
    }, []);

    const handleVoiceChange = (e) => {
        const selectedVoiceIndex = e.target.value;
        setSelectedVoice(voices[selectedVoiceIndex]);
        
        // Stop the current speech
        window.speechSynthesis.cancel();

        // Automatically restart the speech with the new voice
        handleGenerateAudio();
    };

    const handleGenerateAudio = () => {
        if (!selectedVoice) return;

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;

        synth.cancel(); // Stop any ongoing speech
        synth.speak(utterance);
    };

    const handlePause = () => {
        const synth = window.speechSynthesis;
        if (synth.speaking && !isPaused) {
            synth.pause();
            setIsPaused(true);
        } else if (isPaused) {
            synth.resume();
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        const synth = window.speechSynthesis;
        synth.cancel(); // Stop any ongoing speech
        setIsPaused(false);
    };

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        pdfToText(file)
            .then((text) => setText(text))
            .catch((error) => setError("Failed to extract text from PDF"));
    };

    return (
        <div>
            <h2>PDF Text Extractor</h2>
            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <h3>Extracted Text:</h3>
                <p className='p-4'>{text}</p>
            </div>
            <hr />
            <div>
                <label htmlFor="voiceSelect">Select a Voice:</label>
                <select id="voiceSelect" onChange={handleVoiceChange}>
                    {voices.map((voice, index) => (
                        <option key={index} value={index}>
                            {voice.name}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleGenerateAudio}>Generate Audio</button><br/>
            <button onClick={handlePause}>{isPaused ? "Resume" : "Pause"}</button><br/>
            <button onClick={handleStop}>Stop</button>
        </div>
    );
};

export default TextToSpeech;
