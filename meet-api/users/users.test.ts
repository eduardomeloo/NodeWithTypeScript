import { response } from 'express'
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

test('patch /users/aaaa - not found', () => {
    return request(address)
        .patch(`/users/aaaa`)
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(404)
        })
})

test('post /users - cpf invalido', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario 5',
            email: 'usuario5@email.com',
            password: '123456',
            cpf: '675.028.222-93'
        }).then(res => {
            expect(res.status).toBe(400)
            expect(res.body.errors).toBeInstanceOf(Array)
            expect(res.body.errors).toHaveLength(1)
            expect(res.body.errors[0].message).toContain('Invalid CPF')
        })
})

test('post /users - email duplicado', async () => {
    const user = {
        name: 'usuario 6',
        email: 'usuario6@email.com',
        password: '123456',
        cpf: '593.436.344-12'
    }
    await request(address)
        .post('/users').set('Authorization', auth).send(user)

    const save2 = await request(address)
        .post('/users').set('Authorization', auth).send(user)                        

    expect(save2.status).toBe(400)
    expect(save2.body.message).toContain('E11000 duplicate key')
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

test('put /users/aaaa - not found', () => {
    return request(address)
        .put('/users/aaaa')
        .set('Authorization', auth)
        .then(response => {
            expect(response.status).toBe(404)
        })
})
/*
  1. Cria-se um usuario com gender Male
  2. Atualiza, mas nao informa gender
  3. Testa se o documento foi substituido -> gender undefined
*/

test('put /users/:id', () => {
    return request(address)
        .post('/users')
        .set('Authorization', auth)
        .send({
            name: 'usuario 7',
            email: 'user7@email.com',
            password: '123456',
            cpf: '613.586.318-59',
            gender: 'Male'
        }).then(response => 
            request(address)
            .put(`/users/${response.body._id}`)
            .set('Authorization', auth)
            .send({
                name: 'usuario 7',
                email: 'user7@email.com',
                password: '123456',
                cpf: '613.586.318-59'
            }))
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.name).toBe('usuario 7')
            expect(response.body.email).toBe('user7@email.com')
            expect(response.body.cpf).toBe('613.586.318-59')
            expect(response.body.gender).toBeUndefined()
            expect(response.body.password).toBeUndefined()
        })
})

test('authenticate user - not authorized', () => {
    return request(address)
        .post('/users/authenticate')
        .send({
            email:"admin@email.com",
            password:"123"
        })
        .then(response => {
            expect(response.status).toBe(403)
        })
})

test('authenticate user', () => {
    return request(address)
        .post('/users/authenticate')
        .send({
            email:"admin@email.com",
            password:"123456"
        })
        .then(response => {
            expect(response.status).toBe(200)
            expect(response.body.accessToken).toBeDefined()
        })
})