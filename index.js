var express = require('express');
var ParseServer = require('parse-server').ParseServer;

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
    console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
    databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
    cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
    appId: process.env.APP_ID || 'myAppId',
    masterKey: process.env.MASTER_KEY || '',
    serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',
    liveQuery: {
        classNames: []
    },
    verbose: !process.env.PRODUCTION
});

var app = express();

var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

app.get('/', function (req, res) {
    res.status(200).send('');
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, '0.0.0.0', function () {
    console.log('parse-server running on port ' + port + '.');
});

ParseServer.createLiveQueryServer(httpServer);