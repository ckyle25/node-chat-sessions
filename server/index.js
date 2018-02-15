const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const mc = require( `${__dirname}/controllers/messages_controller` );
const filter = require('./middlewares/filter.js')

const createInitialSession = require( `${__dirname}/middlewares/session.js` );

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../public/build` ) );
app.use(session({
    secret: '@nyth!ng y0u w@nT',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 10000 }
    })
)

app.use((req,res,next) => {
    if(req.method === 'PUT' || req.method === 'POST') {
        filter(req,res,next);
    } else {
    next();
    }
})
app.use( ( req, res, next ) => createInitialSession( req, res, next ) );

const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.get(`${messagesBaseUrl}/history`,mc.history);
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );