const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/7c34029ee7280774a6d285098e5c7f30/' + latitude + ',' + longitude

    request({url, json: true}, (error, {body}) => {// destructured the response object
        if (error){
            callback('Unable to connect to weather service!', undefined)
        } else if (body.error){
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, body.daily.data[0].summary + ' The high for today is ' + 
            body.daily.data[0].temperatureHigh + ' degrees F and the low is ' + body.daily.data[0].temperatureLow + " degrees. " +
            'There is a ' + parseInt(body.daily.data[0].precipProbability * 100) + '% chance of rain.  ' +
            'It is currently ' + body.currently.temperature + ' degrees F')
        }
    })

}

module.exports = forecast

