require('dotenv').config();
const express = require('express');
const socket = require('socket.io');
const dbConnection = require('./confiq/db');
const app = express();
const Todo = require('./model/todoModel');

dbConnection();


// Connection with socket.io
const server = app.listen(8000, function () {
    console.log('Alhamdulliah server running!');
});

const io = require('socket.io')(server, {
    cors: {
        origin: "*"
    }
});

// Ensure socket connection
io.on('connection', (socket) => {


    // For frontend connection
    console.log('New Client Connected!');

    // For backend connection
    socket.emit('connected', 'Backend connected with frontend!');

    // Crud Operations
    socket.on('create', (data) => {
        const todo = new Todo({
            name: data.name,
            description: data.description,
        });

        todo.save();

        io.emit('created', todo);
    });

    // Read Data
    socket.on('read', async () => {
        let todoData = await Todo.find({});

        socket.emit('read', todoData);
    });


    // Delete Data 
    socket.on('deleted', async (id) => {

        console.log(id);

        await Todo.findByIdAndRemove(id);

        io.emit('deleted',id);

    });


});

