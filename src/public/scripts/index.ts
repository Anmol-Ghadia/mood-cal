const dropContainer = document.getElementById('dropContainer') as HTMLElement;
const summaryContainer = document.getElementById("summary") as HTMLElement;

let DATA: string | null = null;

dropContainer.addEventListener('dragover', (event) => {
    event.preventDefault();
});

dropContainer.addEventListener('drop', async (event: DragEvent) =>  {
    event.preventDefault();

    // ensure if we have files dropped into the container
    if (event.dataTransfer && event.dataTransfer.files.length != 0) {
        const file = event.dataTransfer.files[0];
        console.log(file)
        if (file && (file.name.endsWith('.ical') || file.name.endsWith('.ics'))) {
            const data_base64 = await convertToBase64(file); // recevie base 64 converted data
            DATA = data_base64
            dropContainer.dataset.hasData = "1"
        } else {
            alert('Please drop a .ical or .ics file');
        }
    }
});

function submitData() {
    if (DATA != null) {
        summaryContainer.innerText = "...loading";
        fetchData(DATA)

    }
}

function deleteData() {
    if (DATA != null) {
        DATA = null
        dropContainer.dataset.hasData = "0"
    }
} 

async function convertToBase64(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();

    const uint8Array = new Uint8Array(arrayBuffer);
    let binaryString = '';
    
    // Convert each byte to a character
    for (let i = 0; i < uint8Array.length; i++) {
      binaryString += String.fromCharCode(uint8Array[i]);
    }
  
    // Return the Base64-encoded string
    return btoa(binaryString);
}

async function fetchData(converted_data: string) {
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
        summaryContainer.innerText = result.message;
        dropContainer.dataset.hidden = '1';
        console.log('Response from backend:', result);
      })
    .catch(error => {
        console.error('Error:', error);
    });

}
