import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema'
import { Model } from 'mongoose'
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt/dist';
import { SignupDto } from './dto/signup.dto'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtSevice: JwtService
    ){}

    async signup(signupDto: SignupDto ): Promise<{ token: string }> {
        const { name, email, password } = signupDto
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await this.userModel.create({
            name,
            email,
            password: hashedPassword
        })
        const token = this.jwtSevice.sign({ id: user._id })

        return { token }
    }
}
