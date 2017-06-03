var express = require('express');
var path = require('path');
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(9000, () => {
	console.log("lol predictor static site hosted on port 9000");
});
