import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../shared/schema/users.schema';
import { UserDto } from './users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async createUser(createUserDto: UserDto): Promise<User> {
    try {
      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  async getAllUsers(): Promise<any> {
    try {
      const data = await this.userModel.find().select('-password').exec();
      return {
        data,
      };
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error.message,
        error?.statusCode || 500,
      );
    }
  }

  async getUserById(id: number): Promise<User> {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }

  async update(id: string, updateUserDto: UserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('User not found');
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .select('-password')
        .exec();
      if (!user) throw new NotFoundException('User not found');

      console.log('user', user);

      return user;
    } catch (error) {
      throw new HttpException(
        error?.response?.data || error,
        error?.response?.data?.statusCode || error?.statusCode || 400,
      );
    }
  }
}
