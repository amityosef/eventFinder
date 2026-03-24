import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../src/modules/auth/auth.service';
import { UsersService } from '../src/modules/users/users.service';
import { User } from '../src/modules/users/schemas/user.schema';

describe('AuthService', () => {
    let authService: AuthService;
    let usersService: UsersService;
    let jwtService: JwtService;

    const mockUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
        password: 'hashedPassword',
        fullName: 'Test User',
        role: 'User',
        isActive: true,
        refreshTokens: [],
        save: jest.fn().mockResolvedValue(this),
        toObject: jest.fn().mockReturnValue({
            _id: '507f1f77bcf86cd799439011',
            email: 'test@example.com',
            fullName: 'Test User',
            role: 'User',
        }),
    };

    const mockUsersService = {
        findByEmail: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        validatePassword: jest.fn(),
        updateRefreshToken: jest.fn(),
        updateLastLogin: jest.fn(),
    };

    const mockJwtService = {
        sign: jest.fn().mockReturnValue('mockToken'),
        verify: jest.fn(),
    };

    const mockConfigService = {
        get: jest.fn().mockImplementation((key: string) => {
            const config: Record<string, string> = {
                JWT_SECRET: 'test-secret',
                JWT_REFRESH_SECRET: 'test-refresh-secret',
                JWT_EXPIRES_IN: '15m',
                JWT_REFRESH_EXPIRES_IN: '7d',
            };
            return config[key];
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
                {
                    provide: getModelToken(User.name),
                    useValue: {},
                },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        usersService = module.get<UsersService>(UsersService);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('validateUser', () => {
        it('should return user when credentials are valid', async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            mockUsersService.validatePassword.mockResolvedValue(true);

            const result = await authService.validateUser('test@example.com', 'password');

            expect(result).toBeDefined();
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith('test@example.com');
            expect(mockUsersService.validatePassword).toHaveBeenCalledWith(mockUser, 'password');
        });

        it('should return null when user not found', async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);

            const result = await authService.validateUser('nonexistent@example.com', 'password');

            expect(result).toBeNull();
        });

        it('should return null when password is invalid', async () => {
            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            mockUsersService.validatePassword.mockResolvedValue(false);

            const result = await authService.validateUser('test@example.com', 'wrongPassword');

            expect(result).toBeNull();
        });
    });
});
