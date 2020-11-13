const express = require('express');
require('./db/mongoose');
const adminRouter = require('./routers/admin')

// loading express app
const app = express();

// creating port 
const port =  process.env.PORT || 3000

// serving the json for the files
app.use(express.json())

// serving the routers
app.use(adminRouter)
// listening for server res and req...
app.listen(port, () => {
    console.log('server is up on port,', port)
})