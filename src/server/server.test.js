// link to express server file
const app = require('./index')
// User supertest package for testing server/http functionality
const supertest = require('supertest')
const request = supertest(app)

describe('Test getting / endpoint for travel planner site', () => {
    it ('should route to index.html site file', async done => {
        const res =  await request.get('/')
        // check if request was successful
        expect(res.status).toBe(200);
        done();
    })
})
