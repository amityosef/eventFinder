import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication, port: number): void => {
    const config = new DocumentBuilder()
        .setTitle('Event Finder API')
        .setDescription('Event Venue Booking System API Documentation')
        .setVersion('1.0')
        .addServer(`http://localhost:${port}`, 'Local Development Server')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management endpoints')
        .addTag('venues', 'Venue management endpoints')
        .addTag('availability', 'Availability management endpoints')
        .addTag('leads', 'Lead management endpoints')
        .addTag('ai', 'AI-powered search endpoints')
        .addTag('upload', 'File upload endpoints')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    const swaggerOptions = {
        swaggerOptions: {
            persistAuthorization: true,
            tagsSorter: 'alpha',
            operationsSorter: 'alpha',
        },
        customSiteTitle: 'Event Finder API Docs',
    };

    SwaggerModule.setup('swagger', app, document, swaggerOptions);
    SwaggerModule.setup('docs', app, document, swaggerOptions);
};
