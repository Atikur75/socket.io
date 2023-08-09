const mongoose = require('mongoose');
const { Schema } = mongoose;


const todoSchema = new Schema({
    name: String,
    description: String,
});


module.exports = mongoose.model('Todo', todoSchema);