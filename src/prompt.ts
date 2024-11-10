import * as ical from 'ical';

// Decode the Base64 encoded string and generate an iCal JSON object
export function generateFinalObject(base64String: string) {
    const icalJsonObject = makeFirstJsonObject(base64String);
    if (!icalJsonObject) {
        return null;
    }
    console.log("Generated iCal JSON Object:", icalJsonObject);
    const parsedIcalJsonObject = JSON.parse(icalJsonObject);
    console.log("Parsed iCal JSON Object:", parsedIcalJsonObject);
    const filteredEvents = filterEventsForOneWeek(parsedIcalJsonObject);
    const cleanedEvents = removeUnwantedFields(filteredEvents);

    return cleanedEvents;
}

// Generates the initial JSON object and logs it
export function generatePrompt(base64String: string) {
    try {
        const icalJsonObject = makeFirstJsonObject(base64String);
        console.log("Generated iCal JSON Object:", icalJsonObject);
        return icalJsonObject;
    } catch (error) {
        console.error("Error generating iCal JSON object:", error);
        return null;
    }
}

// Parses and converts iCal data to JSON
function makeFirstJsonObject(base64String: string): string | null {
    try {
        const icalData = decodeAndParseICS(base64String);
        console.log("Parsed iCal data:", icalData);
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
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0); // Set to start of the day

    console.log("Filtering events from:", oneWeekAgo, "to:", today);

    const filteredEvents: { [key: string]: any } = {};
    for (const [key, event] of Object.entries(events)) {
        console.log("Processing event:", key);
        if (event.start) {
            const eventDate = new Date(event.start);
            eventDate.setHours(0, 0, 0, 0); // Set to start of the day
            console.log("Event date:", eventDate);

            if (eventDate >= oneWeekAgo && eventDate <= today) {
                console.log("Event is within the range:", key);
                filteredEvents[key] = event;
            } else {
                console.log("Event is outside the range:", key);
            }
        } else {
            console.log("Event does not have a start date:", key);
        }
    }

    console.log("Filtered events:", filteredEvents);
    return filteredEvents;
}

// Cleans up each event by removing unwanted fields and formatting description
function removeUnwantedFields(events: { [key: string]: any }): { [key: string]: any } {
    const cleanedEvents: { [key: string]: any } = {};
    for (const [key, event] of Object.entries(events)) {
        cleanedEvents[key] = {
            description: `Summary: ${event.summary}, Description: ${event.description}`, // Fixed incorrect `$` symbol
            start: event.start,
            location: event.location,
        };
    }
    console.log("Cleaned events:", cleanedEvents);
    return cleanedEvents;
}
