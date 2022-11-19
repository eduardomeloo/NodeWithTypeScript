import 'jest'
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

test('get /users/aaaaa - not found', async () => {
    const response = await request(address)
        .get('/users/aaaaa')
        .set('Authorization', auth)
    expect(response.status).toBe(404);
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