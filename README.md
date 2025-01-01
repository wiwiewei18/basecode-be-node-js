# Node.js Base Code

## Introduction

This Node.js base code project provides a foundation for building server-side applications using Node.js. It implements the **Model-View-Controller-Service (MVCS)** architecture to ensure modularity, scalability, and maintainability. The structure is designed to separate concerns, making the application easier to understand and extend.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)
- [Architecture](#architecture)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/wiwiewei18/be-mvcs-basecode.git
   cd be-mvcs-basecode
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**  
   Create a `.env` file in the root directory and add necessary environment variables. A sample `.env.example` file is provided for reference.

## Usage

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Run the tests:**

   ```bash
   npm test
   ```

3. **Start the production server:**

   ```bash
   npm start
   ```

## Features

- **MVCS Architecture:** Organized into Models, Views, Controllers, and Services for better separation of concerns.
- **Modular Code Structure:** Facilitates scalability and maintainability.
- **Basic Error Handling:** Centralized error handling for better debugging.
- **Sample Routes:** Predefined routes for typical use cases.
- **Environment Configurations:** Easy management of environment variables.

## Architecture

The application follows the **MVCS (Model-View-Controller-Service)** architecture pattern:

- **Model:** Handles data and database interactions using Mongoose.
- **View:** Manages the presentation layer, enabling response formatting (e.g., JSON responses for APIs).
- **Controller:** Orchestrates user input, processes requests, and invokes services.
- **Service:** Contains business logic and application rules, promoting reusable and testable components.

This architecture ensures a clear separation of concerns, making it easier to develop, test, and maintain the application.

## Dependencies

- **Node.js:** `>= 16.15.0`
- **Express:** `^4.19.2`
- **bcryptjs:** `^2.4.3`
- **mongoose:** `^8.4.4`
- **jest:** `^29.7.0`
- **supertest:** `^7.0.0`

Additional dependencies can be added as per the project requirements.

## Configuration

Configuration files include:

- `.env`: Environment variables.

## Documentation

- **[API Documentation](https://documenter.getpostman.com/view/17226825/2sA3e4A92c):** Detailed documentation for the API endpoints.

## Troubleshooting

- **Server not starting:**

  - Ensure all dependencies are installed.
  - Check environment variables in the `.env` file.
  - Review logs for specific error messages.

- **Environment variables not loading:**
  - Verify `.env` file exists and variables are correctly defined.
  - Ensure `dotenv` package is correctly installed and required at the top of your application.

## Contributors

- **Wiwie Sanjaya** - Initial work - [wiwiewei18@gmail.com](mailto:wiwiewei18@gmail.com)
