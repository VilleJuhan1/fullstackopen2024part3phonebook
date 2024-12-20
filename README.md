# Phonebook App

This is a fullstack phonebook app utilizing a separate cloud database running on MongoDB and a cloud deployed backend + front (Render). 

The deployed application can be found here:
https://full-stack-open-another-phonebook-app.onrender.com

Disclaimer for course work review: Visual Studio Code Copilot-plugin was used as a support tool for this project.

## Course requirements progress

- All exercises done up to 3.22

## Features

- Add new contacts
- View all contacts
- Filter contacts
- Update existing contacts
- Delete contacts

## Technologies

- Node.js
- Express
- MongoDB

## Installation Instructions

To install and run the project on your local machine, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/VilleJuhan1/fullstackopen2024part3phonebook.git
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a `.env` file in the root of the project and add the following:
    ```
    MONGODB_URI=your_mongodb_uri
    PORT=3001
    ```

4. **Run the application:**
    ```bash
    npm start
    ```

5. **Access the application:**
    Open your browser and go to `http://localhost:3001`
