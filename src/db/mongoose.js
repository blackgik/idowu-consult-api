const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/idowu-consult'

mongoose.connect(url, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
})