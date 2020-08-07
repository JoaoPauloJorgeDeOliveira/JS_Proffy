const express = require('express')        
const server = express()                // Express is a function. Therefore, () is needed
const { pageLanding, pageStudy, pageGiveClasses, saveClasses } = require('./pages')

// Servidor:

// Configuring nunjucks (Template Engine).
const nunjucks = require('nunjucks')
nunjucks.configure(
    'src/views',    // Folder with html files
    {   
    express: server,
    noCache: true,  // Deactivating cache.
    }
)

// Starting server:
server
// Receiving data from req.body:
.use(express.urlencoded({ extended: true}))
// Informing that static files are in folder public.
.use(express.static("public"))
// Configuring routes:
.get("/", pageLanding)
.get("/study", pageStudy)
.get("/give-classes", pageGiveClasses)
.post("/save-classes", saveClasses)         
// Listening on port 5000. 
.listen(5500)