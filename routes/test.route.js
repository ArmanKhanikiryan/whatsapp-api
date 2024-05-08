const testRoute = require('express').Router();

testRoute.get('/test', (req, res) => {
    res.send('Routing Works, You Reach Test Route');
});

export default testRoute;