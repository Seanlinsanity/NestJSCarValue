import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {

    constructor(private usersService: UsersService) {

    }

    @Post("/signup")
    createUser(@Body() body: CreateUserDto) {
        return this.usersService.create(body)
    }

    @Get("/users/:id")
    findUserById(@Param("id") id: string) {
        return this.usersService.findOne(parseInt(id))
    }

    @Get("/users")
    findUserByEmail(@Query("email") email: string) {
        return this.usersService.find(email)
    }

    @Delete("/users/:id")
    deleteUserById(@Param("id") id: string) {
        return this.usersService.remove(parseInt(id))
    }

    @Patch("/users/:id")
    patchUserById(@Param("id") id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(parseInt(id), body)
    }
    
}
