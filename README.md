# Scientific Calculator

A simple, minimal-look scientific calculator web app built with Flask.

🔗 **Live App:** [https://calicfy.onrender.com/](https://calicfy.onrender.com/)

## About

This project is a scientific calculator that is easy to use and designed with a clean, minimal interface. It runs as a lightweight Flask web application.

## Tech Stack

- **Backend:** Flask 3.0.0
- **Server:** Gunicorn 21.2.0
- **Language:** Python

## Project Structure

```
.
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── Procfile             # Deployment configuration (for platforms like Render/Heroku)
├── templates/
│   └── index.html      # Calculator UI
└── README.md
```
## Deployment

This app includes a `Procfile` configured to run with Gunicorn, making it ready for deployment on platforms like Render or Heroku:

```
web: gunicorn app:app
```

## Usage

Simply open the app in your browser and start performing calculations with the minimal, easy-to-use scientific calculator interface.

## License

This project is open source and available for personal or educational use.