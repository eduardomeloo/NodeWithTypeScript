import 'jest'
import * as request from 'supertest'
import { Server } from '../server/server'
import { environment } from '../common/environment'
import { usersRouter } from './users.router'
import { User } from './users.model'

let address: string
let server: Server

beforeAll(() => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3001
    address = `http://localhost:${environment.server.port}`
    server = new Server()
    return server.bootstrap([usersRouter])
        .then(() => User.deleteMany({}).exec())
        .catch(console.error)
})

test('get /users', async () => {
    const response = await request(address)
        .get('/users')
    expect(response.status).toBe(200);
    expect(response.body.items).toBeInstanceOf(Array)
})

test('post /users', async () => {
    const response = await request(address)
        .post('/users')
        .send({
            name: 'Junesco',
            email: 'junesco@josefino.com',
            password: '123456',
            cpf: '756.581.158-09'
        })
    expect(response.status).toBe(200);
    expect(response.body._id).toBeDefined()
    expect(response.body.name).toBe('Junesco')
    expect(response.body.email).toBe('junesco@josefino.com')
    expect(response.body.cpf).toBe('756.581.158-09')
    expect(response.body.password).toBeUndefined()
})

afterAll(() => {
    server.shutdown()
})