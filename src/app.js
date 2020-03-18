const path = require('path')  // core node module
const express = require('express') // npm module
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Set up handlebars engine and views location
app.set('view engine','hbs')  
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// set up static directory to serve
app.use(express.static(publicDirectoryPath))

// home page is now dynamic and uses a view
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Erica Baron'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Erica Baron'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Erica Baron',
        helpMessage: 'Please type in the name of a city'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address){
        return res.send({
            error: 'Please provide an address.'
        }) 
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {  // destructured the data object
        if (error){
            return res.send({error})
        } // end if

        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({error})
            } // end if
            
            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })

    
})

app.get('/products', (req, res) => {
    if (!req.query.search){
        return res.send({
            error: 'You must provide a search term'
        })
    }
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help Article 404',
        name: 'Erica Baron',
        errorMessage: 'Help article not found',
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Error Page',
        name: 'Erica Baron',
        errorMessage: 'Page not found'
    })
})

// Start the server
app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})