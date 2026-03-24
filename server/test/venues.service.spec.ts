import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { VenuesService } from '../src/modules/venues/venues.service';
import { Venue } from '../src/modules/venues/schemas/venue.schema';

describe('VenuesService', () => {
    let service: VenuesService;
    let mockVenueModel: any;

    const mockVenue = {
        _id: '507f1f77bcf86cd799439011',
        name: 'היכל האירועים הגדול',
        description: 'אולם אירועים מפואר בלב תל אביב',
        location: {
            city: 'תל אביב',
            neighborhood: 'רמת החייל',
            region: 'מרכז',
            address: 'רחוב הברזל 15',
            coordinates: {
                type: 'Point',
                coordinates: [34.8113, 32.1133],
            },
        },
        capacity: { min: 150, max: 500 },
        price: { amount: 250, type: 'perPerson', currency: 'ILS' },
        features: {
            kosher: true,
            accessibility: true,
            parking: true,
        },
        gallery: ['https://example.com/image1.jpg'],
        mainImage: 'https://example.com/image1.jpg',
        isActive: true,
        save: jest.fn().mockResolvedValue(this),
    };

    beforeEach(async () => {
        mockVenueModel = {
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            countDocuments: jest.fn(),
            exec: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                VenuesService,
                {
                    provide: getModelToken(Venue.name),
                    useValue: mockVenueModel,
                },
            ],
        }).compile();

        service = module.get<VenuesService>(VenuesService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll', () => {
        it('should return an array of venues with pagination', async () => {
            const mockQuery = {
                populate: jest.fn().mockReturnThis(),
                sort: jest.fn().mockReturnThis(),
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockReturnThis(),
                exec: jest.fn().mockResolvedValue([mockVenue]),
            };

            mockVenueModel.find.mockReturnValue(mockQuery);
            mockVenueModel.countDocuments.mockResolvedValue(1);

            const result = await service.findAll({});

            expect(result).toHaveProperty('venues');
            expect(result).toHaveProperty('total');
            expect(result.venues).toHaveLength(1);
            expect(result.total).toBe(1);
        });
    });

    describe('findById', () => {
        it('should return a venue by id', async () => {
            mockVenueModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockVenue),
            });

            const result = await service.findById('507f1f77bcf86cd799439011');

            expect(result).toEqual(mockVenue);
            expect(mockVenueModel.findById).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
        });

        it('should throw NotFoundException when venue not found', async () => {
            mockVenueModel.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(null),
            });

            await expect(service.findById('507f1f77bcf86cd799439011')).rejects.toThrow();
        });
    });
});
