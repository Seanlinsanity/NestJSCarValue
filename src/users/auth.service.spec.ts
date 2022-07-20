import { BadRequestException } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import { AuthService } from "./auth.service"
import { User } from "./user.entity"
import { UsersService } from "./users.service"

describe('AuthService', () => {
    let service: AuthService
    let mockUsersService: Partial<UsersService>

    beforeEach(async() => {
        const users: User[] = []
        mockUsersService = {
            find: (email: string) => {
                return Promise.resolve(users.filter(user => user.email === email))
            },
            create: (email: string, password: string) => {
                const user = {id: Math.floor(Math.random() * 99999), email, password} as User
                users.push(user)
                return Promise.resolve(user)
            }
        }

        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUsersService
                }
            ]
        }).compile()

        service = module.get(AuthService)
    })

    it('Test auth service creation', async () => {
        expect(service).toBeDefined()
    })

    it('creates a new user with a salted and hashed password',async () => {
        const user = await service.signup('sean@gmail.com', '123456')

        expect(user.password).not.toEqual('123456')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined()
        expect(hash).toBeDefined()
    })

    it('throws an error if email is in use', async () => {
        await service.signup("sean@gmail.com", "123456")
        await expect(service.signup("sean@gmail.com", "123456")).rejects.toThrow(
            BadRequestException
        );
    })

    it('sign in with unexisted email',async () => {
        await expect(service.signin("sean@gmail.com", "123456")).rejects.toThrow(
            BadRequestException
        );
    })

    it('sign in with wrong credentials',async () => {
        await service.signup("sean@gmail.com", "123456")
        await expect(service.signin("sean@gmail.com", "00000")).rejects.toThrow(
            BadRequestException
        );
    })

    it('sign in successfully',async () => {
        await service.signup("sean@gmail.com", "123456")
        const user =  await service.signin("sean@gmail.com", "123456")
        expect(user).toBeDefined()
    })

})