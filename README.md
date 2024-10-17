# PinBoard Project - Backend Branch

## Overview
The Pinboard project is a web application that allows users to create and manage notes. This back-end service is built using Node.js and Express, providing a RESTful API for the front-end to interact with.


## Table of Contents
1. [Technologies Used](#technologies-used)
2. [Installation](#Installation)
3. [Scripts](#scripts)
4. [API Endpoints](#api-endpoints)
5. [Features](#features)
6. [License](#license)
7. [Author](#author)


## Technologies Used

- **Languages**: JavaScript (Node.js)
- **Frameworks**: 
  - Express.js (for the server)
- **Database**: 
  - MongoDB (for data storage)
- **Libraries**: 
  - bcrypt (for password hashing)
  - bull (for job and message queue)
  - cors (for enabling CORS)
  - dotenv (for environment variable management)
  - jsonwebtoken (for authentication)
  - nodemailer (for sending emails)
  - uuid (for unique identifier generation)


## Installation

To set up the project locally, follow these steps:

   1- Clone the repository:
        ```bash
        git clone https://github.com/HebaM94/PinBoard-BackEnd.git
   
   2- Navigate to the project directory:

        cd PinBoard-BackEnd

   3- Install the dependencies:

        npm install


   4- Start the development server:

        npm run dev


## Scripts

- Start the server:

       npm start

-  Start the server in development mode:

       npm run dev

- Lint the code:

       npm run lint


## API Endpoints

- **POST /register**: Register a new user
- **POST /login**: Login an existing user
- **GET /users/get**: Get the current user
- **PUT /forgot-password**: Send a temporary password to a user
- **POST /reset-password**: Reset a user's password
- **POST /notes**: Create a new note
- **GET /notes**: Get all notes
- **GET /notes/:id**: Read note specified with ID
- **PUT /notes/:id**: Update note specified with ID
- **DELETE /notes/:id**: Delete note specified with ID
- **GET /logout**: Logout the user


## Features

- User registration and account activation
- Password management with SHA-1
- Email notifications using Nodemailer
- User authentication using JWT


## License

This project is licensed under the ISC License.


## Contact

For any questions or inquiries, please contact:

    Author: Heba Magdy
    GitHub: HebaM94

