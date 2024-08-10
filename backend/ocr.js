// backend/ocr.js

const fs = require('fs');
const path = require('path');
const { OcrMyPdf } = require('ocrmypdf-js');

const STORAGE_DIR = 'uploads';  // Ensure this matches the directory used in your server

module.exports = {
    init() {
        if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR);
    },

    async processOCR(inputFile, outputFile) {
        try {
            const ocrmypdf = new OcrMyPdf();
            await ocrmypdf.execute({
                inputPath: inputFile,
                outputPath: outputFile,
                args: ['-l eng']  // Set language or other options as needed
            });
            console.log(`OCR process finished. Output file: ${outputFile}`);
        } catch (error) {
            console.error(`Error processing OCR: ${error.message}`);
            throw error;
        }
    }
};
