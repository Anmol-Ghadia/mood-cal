// import { rejects } from "assert";
// import { error } from "console";
// import { resolve } from "path";
// import { Buffer } from "buffer";
// import { response } from "express";
// import { resourceUsage } from "process";

const dropContainer = document.getElementById('dropContainer') as HTMLElement;

dropContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
});

dropContainer.addEventListener('drop', async (event: DragEvent) =>  {
    event.preventDefault();

    // ensure if we have files dropped into the container
    if (event.dataTransfer && event.dataTransfer.files.length != 0) {
        const file = event.dataTransfer.files[0];
        if (file && file.name.endsWith('.ical') || file.name.endsWith('.ics')) {
            const data_base64 = await convertToBase64(file); // recevie base 64 converted data
            console.log('converted data to base 64', data_base64);
            receiveFromBackend(data_base64); // send converted data to backend
        } else {
            alert('Please drop a .ical or .ics file');
        }
    }
});

async function convertToBase64(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
}

async function receiveFromBackend(converted_data: string) {
    fetch('api/data', {
        method: 'POST',
        headers: {'Content-Type': 'application/json',
        },
        body: JSON.stringify({data: converted_data})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to send data to backend');
        }
        return response.json();
    })
    .then(result => {
        console.log('Response from backend:', result);
      })
    .catch(error => {
        console.error('Error:', error);
    });

}
