import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 12)
      : undefined;

    const user = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return user.save();
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  }): Promise<{ users: UserDocument[]; total: number; pages: number }> {
    const { page = 1, limit = 10, role, search } = query;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [users, total] = await Promise.all([
      this.userModel.find(filter).skip(skip).limit(limit).exec(),
      this.userModel.countDocuments(filter),
    ]);

    return {
      users,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<UserDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password +refreshTokens');
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
    const user = await this.findById(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 12);
    }

    Object.assign(user, updateUserDto);
    return user.save();
  }

  async delete(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) {
      throw new NotFoundException('User not found');
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    const user = await this.userModel.findById(userId).select('+refreshTokens');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (refreshToken === null) {
      user.refreshTokens = [];
    } else {
      const hashedToken = await bcrypt.hash(refreshToken, 10);
      user.refreshTokens.push(hashedToken);
      // Keep only last 5 refresh tokens
      if (user.refreshTokens.length > 5) {
        user.refreshTokens = user.refreshTokens.slice(-5);
      }
    }

    await user.save();
  }

  async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const user = await this.userModel.findById(userId).select('+refreshTokens');
    if (!user || !user.refreshTokens.length) {
      return false;
    }

    for (const storedToken of user.refreshTokens) {
      const isValid = await bcrypt.compare(refreshToken, storedToken);
      if (isValid) return true;
    }

    return false;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }

  async validatePassword(user: UserDocument, password: string): Promise<boolean> {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  }

  async createOrUpdateGoogleUser(profile: {
    googleId: string;
    email: string;
    fullName: string;
    avatar?: string;
  }): Promise<UserDocument> {
    let user = await this.findByGoogleId(profile.googleId);

    if (!user) {
      user = await this.userModel.findOne({ email: profile.email });
      if (user) {
        user.googleId = profile.googleId;
        if (!user.avatar && profile.avatar) {
          user.avatar = profile.avatar;
        }
        await user.save();
      } else {
        user = await this.create({
          email: profile.email,
          fullName: profile.fullName,
          avatar: profile.avatar,
          googleId: profile.googleId,
        });
      }
    }

    return user;
  }
}
