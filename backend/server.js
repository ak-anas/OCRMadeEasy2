// backend/server.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { processOCR } = require('./ocr'); // Import the updated OCR processing module

const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Configure multer for file storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Endpoint to handle file uploads and OCR processing
app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const outputFilePath = filePath.replace('.pdf', '-ocr.pdf');

    try {
        console.log(`Processing file: ${filePath}`);
        await processOCR(filePath, outputFilePath);
        console.log(`Processed file: ${outputFilePath}`);
        res.json({ message: 'File processed successfully', file: path.basename(outputFilePath) });
    } catch (error) {
        console.error(`Error processing file: ${error.message}`);
        res.status(500).json({ message: 'Error processing file', error: error.message });
    }
});

// Endpoint to serve the processed file for download
app.get('/download/:filename', (req, res) => {
    const file = path.join(__dirname, 'uploads', req.params.filename);
    res.download(file, (err) => {
        if (err) {
            console.error(`Error sending file: ${err.message}`);
            res.status(500).json({ message: 'Error sending file', error: err.message });
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
