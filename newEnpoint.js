const app = require('express')();

app.get('/new-endpoint', (req, res) => {
    console.log(req.body.message, 'My message is retrieved from the request body');
    res.json({ message: 'Hello, World!' });
});

app.listen(9999, () => {
    console.log('Server is running on port 9999');
});