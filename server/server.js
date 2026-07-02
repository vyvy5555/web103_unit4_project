import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import dotenv from 'dotenv'
import cors from 'cors'

// import the router from your routes file
import carRoute from './routes/cars.js'
import exteriorRoute from './routes/exteriors.js'
import interiorRoute from './routes/interiors.js'
import wheelsRoute from './routes/wheels.js'
import roofRoute from './routes/roofs.js'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())
app.use(cors)

if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'lightning.png')))
}
else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'lightning.png')))
    app.use(express.static('public'))
}

// specify the api path for the server to use
app.use('/car', carRoute)
app.use('/exterior', exteriorRoute)
app.use('/interior', interiorRoute)
app.use('/wheels', wheelsRoute)
app.use('/roof', roofRoute)

if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    )
}

app.listen(PORT, () => {
    console.log(`server listening on http://localhost:${PORT}`)
})