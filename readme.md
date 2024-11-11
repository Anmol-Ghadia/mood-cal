# EquiMind

**EquiMind** is a mood tracking and summarization application designed to help users monitor their mental health and well-being. It integrates with Google and Apple calendars to provide personalized mood analysis and actionable suggestions.

## Features

- **Calendar Integration**: Create a mood calendar on Google Calendar or Apple Calendar.
- **Data Upload**: Download the `.ics` file of your calendar, then upload it to EquiMind for analysis.
- **Mood Summary & Suggestions**: Get personalized feedback and suggestions for mood enhancement.
- **Weekly Mood Graph**: View a graph displaying mood variations throughout the week.
- **Professional Help Recommendations**: EquiMind suggests seeking professional help if mental health indicators are low.

## Getting Started

### mood-cal

To set up the project, run:

```sh
npm install
```

Then start the server with:

```sh
npm run start
```

### Project Structure
1) **Frontend**: Everything in `src/public`
2) **Backend**: Everything in `src` that is not part of the frontend

### API Key Format in `.env`
```plaintext
OPENAI_API_KEY="your key here"
```

## License

EquiMind is open-source software licensed under the MIT License. See `LICENSE` for details.
