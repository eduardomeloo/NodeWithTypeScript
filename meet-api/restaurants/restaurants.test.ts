import 'jest'

import * as request from 'supertest'

const address: string = `http://localhost:${process.env.SERVER_PORT_TESTE || 5001}`
const auth: string = (<any>global).auth

test('get /restaurants', () => {
    return request(address)
        .get('/restaurants')
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.items).toBeInstanceOf(Array)
        })
})

test('get /restaurants/aaaa - not founf', () => {
    return request(address)
        .get('/restaurants/aaaa')
        .then(response => {
            expect(response.status).toBe(404)
        })
})

/*
  Exemplo de como pode ser um post para restaurants
*/

test('post /restaurants', () => {
    return request(address)
        .post('/restaurants')
        .set('Authorization', auth)
        .send({
            name: 'Burger House',
            menu: [{name: 'Coke', price: 5}]
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('Burger House')
            expect(response.body.menu).toBeInstanceOf(Array)
            expect(response.body.menu).toHaveLength(1)
            expect(response.body.menu[0]).toMatchObject({name: 'Coke', price: 5})
        })
})