import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private repo: Repository<User>) {

    }

    create(email: string, password: string) {
        const user: User = this.repo.create({ email, password })
        return this.repo.save(user);
    }

    findOne(id: number) {
        return this.repo.findOneBy({id: id})
    }

    find(email: string) {
        return this.repo.findBy({ email })
    }

    async update(id: number, attrs: Partial<User>) {
        const user: User = await this.findOne(id)
        if (!user) {
            throw new NotFoundException;
        }
        Object.assign(user, attrs)
        return this.repo.save(user)
    }

    async remove(id: number) {
        const user: User = await this.findOne(id)
        if (!user) {
            throw new ForbiddenException
        }
        return this.repo.remove(user)
    }
}
