const express = require('express');
const fs = require('fs')

const app = express();

app.get('/', (request, response) => {

    fs.readFile('./home.html', 'utf8', (err, html) =>{
        response.send(html);
    })
} );


app.listen(3000, ()=> console.log('listening on 3000'))