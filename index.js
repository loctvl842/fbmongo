const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const uploadRoute = require('./routes/upload');
const conversationRoute = require('./routes/conversation');
const messageRoute = require('./routes/message');

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () => {
    console.log('Connect to database successfully <3 <3 <3');
});
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// middleware
app.use(express.json()); // body parser
app.use(helmet());
app.use(morgan('common'));

// upload to s3
app.use('/api/upload', uploadRoute);
app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversation', conversationRoute);
app.use('/api/message', messageRoute);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
