import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GoogleCredentialDto {
    @ApiProperty({
        description: 'Google ID token credential from Google Identity Services',
        example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6Ij...'
    })
    @IsString()
    credential: string;
}
