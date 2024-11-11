import * as ical from 'ical';

// Decode the Base64 encoded string and generate an iCal JSON object
export function generateArrayOfData(base64String: string): string {
    const icalJsonObject = makeFirstJsonObject(base64String);
    if (!icalJsonObject) {
        return "";
    }
   
    const parsedIcalJsonObject = JSON.parse(icalJsonObject);
   
    const filteredEvents = filterEventsForOneWeek(parsedIcalJsonObject);


    const cleanedEvents = removeUnwantedFields(filteredEvents);

    return `Using ${cleanedEvents}, identify the user's current mood from: Happy, Calm, Focused, Neutral, Sad, Anxious, Angry, or Stressed.
    An array of 7 mood classifications, one per day. The format:  
    Don't mention the day or date, just array of format:
     ["classification: reason", "classification: reason", "classification: reason", "classification: reason",
      "classification: reason", "classification: reason", "classification: reason"].`;
}

export function generateSummaryPrompt(base64String: string): string {
    const icalJsonObject = makeFirstJsonObject(base64String);
    if (!icalJsonObject) {
        return "";
    }
    // console.log("Generated iCal JSON Object:", icalJsonObject);
    const parsedIcalJsonObject = JSON.parse(icalJsonObject);
    // console.log("Parsed iCal JSON Object:", parsedIcalJsonObject);
    const filteredEvents = filterEventsForOneWeek(parsedIcalJsonObject);
    // console.log("Filtered iCal JSON Object:", filteredEvents);

    const cleanedEvents = removeUnwantedFields(filteredEvents);

    return summaryPrompt(cleanedEvents);
}

// Generates the initial JSON object and logs it
function summaryPrompt(data: string): string {
    if (data === "" || data === undefined) {
        throw new Error("No data provided");
    }

    const prompt = 
`Using ${data}
Return:
Give plain text response. Given the above calendar data, summarize the mood in short and
leavea a line then give recomendations to improve mood in the future. Write a 2 to 3 sentences`;
    console.log("Prompt:", prompt);
     return prompt;

}

// Parses and converts iCal data to JSON
function makeFirstJsonObject(base64String: string): string | null {
    try {
        const icalData = decodeAndParseICS(base64String);
        // console.log("Parsed iCal data:", icalData);
        return JSON.stringify(icalData, null, 2);
    } catch (error) {
        console.error("Error converting iCal data to JSON:", error);
        return null;
    }
}

// Decodes Base64 and parses iCal content
function decodeAndParseICS(base64String: string): ical.FullCalendar {
    try {
        const decodedData = Buffer.from(base64String, 'base64').toString('utf-8');
        return ical.parseICS(decodedData);
    } catch (error) {
        console.error("Error decoding and parsing iCal data:", error);
        throw error; // Re-throw error to be handled at higher levels
    }
}

// Filters events from today to one week ago
function filterEventsForOneWeek(events: { [key: string]: any }): { [key: string]: any } {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today for accurate range checking
    today.setDate(today.getDate()); // !!! Added, remove please
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0); // Set to start of the day

    // console.log("Filtering events from:", oneWeekAgo, "to:", today);

    const filteredEvents: { [key: string]: any } = {};
    for (const [key, event] of Object.entries(events)) {
        if (event.start) {
            const eventDate = new Date(event.start);
            console.log("Event date:", eventDate);
            if (eventDate >= oneWeekAgo && eventDate <= today) {
                filteredEvents[key] = event;
            }
        }
    }

    // console.log("Filtered events:", filteredEvents);
    return filteredEvents;
}

// Cleans up each event by removing unwanted fields and formatting description
function removeUnwantedFields(events: { [key: string]: any }): string {
    // const cleanedEvents: { [key: string]: any } = {};
    let cleanedEvents: string = '';
    for (const [key, event] of Object.entries(events)) {
        cleanedEvents +=
            `Title: ${event.summary}\n` + 
            `   Description: ${event.description}\n` +
            `   Start time: ${event.start}\n`
    }
    return cleanedEvents;
}