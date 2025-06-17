import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterRequest } from 'src/models/requests/auth/models';
import { User } from 'src/users/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) { }

  async findOne(email: string): Promise<User | null> {
    return this.userModel
      .findOne({
        email: {
          $eq: email,
        },
      })
      .exec();
  }

  async create(registerRequest: RegisterRequest): Promise<User> {
    const newUser = new this.userModel(registerRequest)
    return newUser.save();
  }
}
