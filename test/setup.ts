import { rm } from "fs"
import { join } from "path"
import { getConnection } from "typeorm"

global.beforeEach(async () => {
    try {
        await rm.__promisify__(join(__dirname, '..', 'test.sqlite'))
    } catch (err) {
        console.log(err)
    }
})