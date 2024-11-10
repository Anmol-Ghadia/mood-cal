import { response } from "express";

const dropContainer = document.getElementById('dropContainer') as HTMLElement;
const summaryContainer = document.getElementById("summary") as HTMLElement;


let DATA: string | null = null;
let MOODS_ARRAY: string[] | null= null;
let MOODS_NUM_ARRAY: number[] | null = null;

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
        MOODS_ARRAY = filterArray(result.moodsArray);
        MOODS_NUM_ARRAY = convertWordsToPoint(MOODS_ARRAY);

        dropContainer.dataset.hidden = '1';
        console.log('Response from backend:', result);
      })
    .catch(error => {
        console.error('Error:', error);
    });
}

function filterArray(response_array: string[]): string[] {
    const filtered_array: string[] = [];
    response_array.forEach((element) => {
      const [word] = element.split(","); // spliting the element at ","
      filtered_array.push(word.trim()); // trim to remove extra spaces
        
    });
    return filtered_array;
}

function convertWordsToPoint(filtered_array: string[]): number[] {
    const pointsArray: number[] = [];
    for (let i = 0; i < filtered_array.length; i++) {
        const element = filtered_array[i];
        let point = 0;
        switch (element) {
            case "Happy": 
            point = 5;
            break;
            case "Calm": 
            point = 3;
            break;
            case "Focused": 
            point = 2;
            break;
            case "Neutral": 
            point = 0;
            break;
            case "Sad": 
            point = -2;
            break;
            case "Anxious": 
            point = -3;
            break;
            case "Angry": 
            point = -4;
            break;
            case "Stressed": 
            point = -5;
            break;
            default:
                point = 0;
                break;
        }
        pointsArray.push(point);
        
    }
    return pointsArray;
  }

  function giveInformationForHelp(pointsArray: number[]) {
    if (helpNeeded(pointsArray)) {
        const showHelpDiv = document.getElementById('showHelp') as HTMLElement;
        if (showHelpDiv) {
            showHelpDiv.style.display = 'block';
        }
    }
  }
  

  function helpNeeded(pointsArray: number[]): boolean {
    let sum = 0;
    for (let i = 0; i < pointsArray.length; i++) {
      sum += pointsArray[i];
    }
    return (sum/pointsArray.length) < -2;
  }