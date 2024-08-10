// public/script.js

document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const processButton = document.getElementById('processButton');

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('hover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('hover');
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('hover');

        const files = event.dataTransfer.files;
        if (files.length > 0 && files[0].type === 'application/pdf') {
            fileInput.files = files; // Set the file input value
        } else {
            alert('Please drop a valid PDF file.');
        }
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0 && fileInput.files[0].type === 'application/pdf') {
            uploadFile(fileInput.files[0]);
        }
    });

    processButton.addEventListener('click', () => {
        if (fileInput.files.length > 0) {
            uploadFile(fileInput.files[0]);
        } else {
            alert('No file selected for processing.');
        }
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.file) {
                // Automatically download the processed file
                const downloadLink = document.createElement('a');
                downloadLink.href = `/download/${data.file}`;
                downloadLink.download = data.file;
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            } else {
                console.error('Error:', data.message);
            }
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
    }
});
