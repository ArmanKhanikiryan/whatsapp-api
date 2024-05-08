const testRoute = require('express').Router();

testRoute.get('/hello', (req, res) => {
    res.send('Router working well')
})
module.exports = testRoute;