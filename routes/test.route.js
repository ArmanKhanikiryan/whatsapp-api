const testRoute = require('express').Router();

testRoute.get('/hi', (req, res) => {
    res.send('Routing Works, You Reach Test Route');
});

export default testRoute;