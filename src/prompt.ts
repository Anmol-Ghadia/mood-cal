import * as ical from 'ical';

// Decode the Base64 encoded string and generate an iCal JSON object
export function generateArrayOfData(base64String: string): string {
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

    const prompt = `Using ${data}, identify the user's current mood from: Happy, Calm, Focused, Neutral, Sad, Anxious, Angry, or Stressed.
        Return:
        A 3-sentence weekly summary:
        An average classification for the week.
        Don't bold or format the response. 
        Suggest continuing current habits if positive.
        Suggest finding happiness-boosting activities if varied.
        Suggest some activities to reduce stress if negative (give examples if neccessary).
        Make sure that you cover each day and every fluctuation you see. 
        Add '#help' if signs of depression appear consistently.
        Make sure all are included in the response.`;
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
    today.setDate(today.getDate() + 7); // !!! Added, remove please
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0); // Set to start of the day

    // console.log("Filtering events from:", oneWeekAgo, "to:", today);

    const filteredEvents: { [key: string]: any } = {};
    for (const [key, event] of Object.entries(events)) {
        // console.log(`Processing event: ${key}: ${event.start}` );
        if (event.start) {
            const eventDate = new Date(event.start);
            console.log("Event date:", eventDate);
            // eventDate.setHours(0, 0, 0, 0); // Set to start of the day

            if (eventDate >= oneWeekAgo && eventDate <= today) {
                // console.log("Event is within the range:", key);
                filteredEvents[key] = event;
            } else {
                // console.log("Event is outside the range:", key);
            }
        } else {
            // console.log("Event does not have a start date:", key);
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