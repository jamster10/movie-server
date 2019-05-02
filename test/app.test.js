'use strict';

const app = require('../app');
const expect = require('chai').expect;
const request = require('supertest');

describe('GET for /Movies', () => {
  it('Handles access to server', ()=> {
    return request(app)
      .get('/movie')
      .query({genre: 'dram', avg_vote: '7.7', country: 'united states'})
      .then( res => {
        expect(res.body.error).to.eql('You do not have access to this server. GO AWAY, OR ELSE');
      });
    
  });

  it('Access to server with incorrect path', ()=> {
    return request(app)
      .get('/movies')
      .set('Authorization', 'Bearer chick-fil-a')
      .query({genre: 'dram', avg_vote: '7.7', country: 'united states'})
      .expect(404); 
  });

  it('Handles no params', ()=> {
    return request(app)
      .get('/movie')
      .set('Authorization', 'Bearer chick-fil-a')
      .expect(413, 'Your request is too large. Please filter'); 
  });



});