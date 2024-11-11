const dropContainer = document.getElementById('dropContainer') as HTMLElement;
const summaryContainer = document.getElementById("summary") as HTMLElement;
const outputContainer = document.getElementById("output") as HTMLElement;
const mainContainer = document.getElementById("container") as HTMLElement;

let DATA: string | null = null;
let MOODS_ARRAY: string[]= [];
let MOODS_DESC: string[]= [];
let MOODS_NUM_ARRAY: number[]= [];

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
        setGlobalArrs(result.moodsArray);
        
        makeGraph(MOODS_ARRAY,MOODS_NUM_ARRAY);

        dropContainer.dataset.hidden = '1';
        mainContainer.dataset.outputShown = "1";
        outputContainer.dataset.hidden = "0";
        console.log('Response from backend:', result);
      })
    .catch(error => {
        console.error('Error:', error);
    });
}

function setGlobalArrs(response_array: string[]): string[] {
    const filtered_array: string[] = [];
    response_array.forEach((element) => {
        const word = element.split(":")[0]
      MOODS_ARRAY.push(word); // trim to remove extra spaces
      MOODS_DESC.push(element.split(":")[1]); // trim to remove extra spaces
      MOODS_NUM_ARRAY.push(convetWordToPoint(word));
    });
    giveInformationForHelp(MOODS_NUM_ARRAY)
    return filtered_array;
}

function convetWordToPoint(word: string): number {
    let point = 0;
    switch (word) {
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
//   console.log(`word: ${word}, points: ${point}`)
    return point;
  }

// Get the context of the canvas element
const mychart: HTMLCanvasElement = document.getElementById('myChart') as HTMLCanvasElement;
const ctx = mychart.getContext('2d') as CanvasRenderingContext2D;
let myLineChart: Chart;
let dataCount = 0;
// Create the line chart
function makeGraph(labels: string[], data:number[]) {

    const config: any = {
        type: 'line', // Line chart type
        data: {
            labels: labels, // X-axis labels
            datasets: [
                {
                label: 'Mood', // Label for the line
                data: data, // Y-axis data
                fill: false, // Do not fill the area under the line
                borderColor: 'rgba(255, 138, 101,1)', // Line color
                tension: 0.3 // Line tension (curvature)
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
            x: {
                title: {
                    display: true,
                    text: 'Last week'
                },
                ticks: {
                    display: false,  // This hides the labels on the x-axis
                },
            },
            y: {
                title: {
                display: true,
                text: 'Mood'
                },
                min: -7,  // Minimum value
                max: 7,  // Maximum value
                ticks: {
                    stepSize: 0  // Interval between ticks
                }
                }
            }
            }
        };
    myLineChart = new Chart(ctx, config);
      }

  function giveInformationForHelp(pointsArray: number[]) {
    if (helpNeeded(pointsArray)) {
        console.log("help needed");
        const showHelpDiv = document.getElementById('showHelp') as HTMLElement;
        showHelpDiv.dataset.hidden = "0"
    } else {
        console.log("help not needed");
    }
  }
  

  function helpNeeded(pointsArray: number[]): boolean {
    let sum = 0;
    for (let i = 0; i < pointsArray.length; i++) {
      sum += pointsArray[i];
    }
    return (sum/pointsArray.length) < -2;
  }
