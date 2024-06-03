const Chatroom = require('./models/Chatroom');
const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const homeHandler = require('./controllers/home');
const roomHandler = require('./controllers/room');

const app = express();
const port = 8080;

mongoose.connect('mongodb://localhost:27017/mydatabase');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', homeHandler.getHome);
app.post('/create', roomHandler.createRoom);
app.get('/:roomName', roomHandler.getRoom);
app.get('/:roomName/messages', roomHandler.getMessages);
app.post('/:roomName/messages', roomHandler.postMessage);

const deleteAllChatrooms = async (req, res) => {
    try {
        await Chatroom.deleteMany({});
        res.status(200).send('All chatrooms deleted successfully.');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

app.delete('/chatrooms', deleteAllChatrooms);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
