import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToClass, plainToInstance } from "class-transformer";
import { map, Observable } from "rxjs";

interface ClassConstructor {
    new (...args: any[]): any
}

export function CustomSerialize(classConstructor: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(classConstructor))
}


export class SerializeInterceptor implements NestInterceptor {
    constructor(private classConstructor: ClassConstructor) {}

    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {

        console.log("serialize interceptor before handler: ", context)
        return next.handle().pipe(
            map((data: any) => {
                console.log("serialize interceptor before response: ", data)
                return plainToInstance(this.classConstructor, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}