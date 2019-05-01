'use strict';

const app = require('./app');
const expect = require('chai');
const request = require('supertest');

describe('GET for /Movies', () => {
  it('Handles too broad a request', ()=> {
    return request(app)
      .get('/movie')
      .query({genre: 'dram', avg_vote: '7.7', country: 'united states'})
      .expect(res.status)
    
  });



});