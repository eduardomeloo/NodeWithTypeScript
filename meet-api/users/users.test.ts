import 'jest'
import { send } from 'process'
import * as request from 'supertest'

const address: string = global.address
const auth: string = global.auth

test('get /users', async () => {
    const response = await request(address)
        .get('/users')
        .set('Authorization', auth)
    expect(response.status).toBe(200);
    expect(response.body.items).toBeInstanceOf(Array)
})

test('post /users', async () => {
    const response = await request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario1',
            email: 'usuario1@email.com',
            password: '123456',
            cpf: '756.581.158-09'
        })
    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined()
    expect(response.body.name).toBe('usuario1')
    expect(response.body.email).toBe('usuario1@email.com')
    expect(response.body.cpf).toBe('756.581.158-09')
    expect(response.body.password).toBeUndefined()
})

test('post /users - nome obrigatório', () => {
    return request(address)
            .post('/users')
            .set('Authorization', auth)
            .send({
                email: 'usuario2@email.com',
                password: '123456',
                cpf: '539.196.590-07'
            }).then(response => {
                expect(response.status).toBe(400)
                expect(response.body.errors).toBeInstanceOf(Array)
                expect(response.body.errors[0].message).toContain('name')
            })
})

/* Primeiro cria-se um novo usuário.
   Depois filtra-se por email na expectativa de retornar apenas
   o que tiver o email identico.
*/

test('get /users - findByEmail', () => {
    return request(address)
            .post('/users')
            .set('Authorization', auth)
            .send({
                name: 'usuário 3',
                email: 'usuario3@email.com',
                password: '123456'
            }).then(response => request(address)
                    .get('/users')
                    .set('Authorization', auth)
                    .query({email: 'usuario3@email.com'}))
            .then(response => {
                expect(response.status).toBe(200)
                expect(response.body.items).toBeInstanceOf(Array)
                expect(response.body.items).toHaveLength(1)
                expect(response.body.items[0].email).toBe('usuario3@email.com')
            })
})

test('get /users/aaaaa - not found', async () => {
    const response = await request(address)
        .get('/users/aaaaa')
        .set('Authorization', auth)
    expect(response.status).toBe(404);
})

test('get /users/:id', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuário 4',
            email: 'usuario4@email.com',
            password: '123456',
            cpf: '482.326.154-27'
        }).then(res => request(address)
                .get(`/users/${res.body._id}`)
                .set('Authorization', auth))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('usuário 4')
            expect(response.body.email).toBe('usuario4@email.com')
            expect(response.body.cpf).toBe('482.326.154-27')
            expect(response.body.password).toBeUndefined()
        })
})

test('delete /users/aaaa - not found', () => {
    return request(address)
            .delete(`/users/aaaa`)
            .set('Authorization', auth)
            .then(response => {
                expect(response.status).toBe(404)
            })
})

test('patch /users/:id', async () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario2',
            email: 'usuario2@email.com',
            password: '123456'
        })
        .then(res => request(address)
                    .patch(`/users/${res.body._id}`)
                    .set('Authorization', auth)
                    .send({
                        name: 'usuario2 - patch'
                    })
        )
        .then(response => {
            expect(response.status).toBe(200);
            expect(response.body._id).toBeDefined()
            expect(response.body.name).toBe('usuario2 - patch')
            expect(response.body.email).toBe('usuario2@email.com')
            expect(response.body.password).toBeUndefined()  
        })  
})