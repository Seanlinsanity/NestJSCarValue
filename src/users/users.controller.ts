import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CustomSerialize } from '../interceptors/serialization.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@CustomSerialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService
    ) {

    }

    @Post("/signup")
    async createUser(@Body() body: CreateUserDto, @Session() session) {
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post("/signin")
    async signin(@Body() body: CreateUserDto, @Session() session) {
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Get("/users/:id")
    findUserById(@Param("id") id: string) {
        console.log("find user by id...")
        return this.usersService.findOne(parseInt(id))
    }

    @Get("/users")
    @UseGuards(AuthGuard)
    findUserByEmail(@CurrentUser() user: User, @Query("email") email: string) {
        console.log("current user result: " + user)
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
