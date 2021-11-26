const express = require('express');
const fs = require('fs')

const app = express();

app.get('/', (request, response) => {

    response.send("test")
    // fs.readFile('./home.html', 'utf8', (err, html) =>{
    //     response.send(html);
    // })
} );


app.listen(8080, ()=> console.log('listening on 8080'))