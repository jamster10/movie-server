'use strict';

const MOVIES = require('./movie_data');
const express = require('express');
const morgan = require('morgan');
require('dotenv').config();

//handle CORS & add further protection
const cors = require('cors');
const helmet = require ('helmet');


const app = express();
const PORT = 8080;

app.use(morgan('dev'));
app.use(cors());
app.use(helmet());

//Handle authentication
function checkAuthorization(){
  
}





app.listen(PORT, console.log('The Portal has opened'))