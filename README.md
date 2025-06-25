Todo App with Backend
Overview
This project is a Todo application built with Express.js, TypeScript, and utilizes the file system to persist user data. It allows users to:

Add todos for specific users.

Retrieve todos by username.

Delete users and their todos.

Delete individual todos.

All data is stored in a data.json file, simulating a database.

Features
Save Users to Server

Users can add todos via a form.

Data is stored as an array of objects in data.json.

If a user already exists, their todos are updated.

Fetch Users

Retrieve a user's todos by their name.

If the user doesn't exist, a "User not found" message is returned.

Delete Users

Delete a user and all their todos.

A confirmation message is returned upon successful deletion.

Delete Todos

Delete a specific todo by its name.

A confirmation message is returned upon successful deletion.

File System Storage

All data is saved to data.json.

The file is created programmatically if it doesn't exist.


Installation
Clone the repository:

git clone <repository-url>
cd todo-app
Install dependencies:

npm install
Build the project:

npm run build
Start the server:


npm start
The application will be accessible at http://localhost:3000.

Usage
Adding a Todo
Navigate to http://localhost:3000.

Enter a username and a todo item.

Click "Add Todo" to submit.

Searching for Todos
Enter a username in the search bar.

Click "Search" to view their todos.

Deleting a User
After searching for a user, click "Delete User" to remove them and their todos.

Deleting a Todo
Click on a todo item to delete it.

Scripts
npm run build: Compiles TypeScript files.

npm start: Starts the server with tsc-watch and nodemon.

npm run dev: Starts the server in development mode with nodemon.

Dependencies
express: Web framework for Node.js.

typescript: TypeScript language support.

tsc-watch: TypeScript file watcher.

nodemon: Utility to monitor for changes in files and automatically restart the server.