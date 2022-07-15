import { Expose } from "class-transformer"

export class UserDto {
    @Expose()
    id: number

    @Expose()
    email: string

    new (...args: any[]): any {
        return new UserDto()
    }

    
}