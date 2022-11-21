import 'jest'
import * as request from 'supertest'
import * as mongoose from 'mongoose'

let address: string = global.address
const auth: string = global.auth

test('get /reviews', () => {
    return request(address)
        .get('/reviews')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
})

test('get /reviews/aaaa - not found', () => {
    return request(address)
        .get('/reviews/aaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
})

/*
  Exemplo de como pode ser um post para reviews
*/

test('post /reviews', () => {
    return request(address)
        .post('/reviews')
        .set('Authorization', auth)
        .send({
            date: '2018-02-02T20:20:20',
            rating: 4,
            comments: 'ok',
            user: new mongoose.Types.ObjectId(),
            restaurant: new mongoose.Types.ObjectId()
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.rating).toBe(4)
            expect(response.body.comments).toBe('ok')
            expect(response.body.user).toBeDefined()
            expect(response.body.restaurant).toBeDefined()
        })
})