var express = require('express');
var app = express();
var router = express.Router();

app.use(express.static('views'));
app.use(express.static('node_modules'));
app.use(express.static('src'));

router.get('/', function () {
  res.send('index.html')
});

app.use('/', router);

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
