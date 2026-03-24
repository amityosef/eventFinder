import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export interface ProcessedImage {
  original: string;
  thumbnail: string;
  medium: string;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadPath: string;
  private readonly maxFileSize: number;

  constructor(private configService: ConfigService) {
    this.uploadPath = this.configService.get<string>('UPLOAD_PATH', './uploads');
    this.maxFileSize = this.configService.get<number>('MAX_FILE_SIZE', 10485760);
    this.ensureUploadDirs();
  }

  private async ensureUploadDirs(): Promise<void> {
    const dirs = ['images', 'images/original', 'images/thumbnail', 'images/medium', 'temp'];
    for (const dir of dirs) {
      const fullPath = path.join(this.uploadPath, dir);
      try {
        await fs.mkdir(fullPath, { recursive: true });
      } catch (error) {
        // Directory might already exist
      }
    }
  }

  async processAndSaveImage(
    file: Express.Multer.File,
  ): Promise<ProcessedImage> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Allowed: JPEG, PNG, WebP, GIF');
    }

    // Validate file size
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`File too large. Maximum size: ${this.maxFileSize / 1024 / 1024}MB`);
    }

    const fileId = uuidv4();
    const extension = '.webp'; // Convert all to WebP for better compression
    const fileName = `${fileId}${extension}`;

    const originalPath = path.join(this.uploadPath, 'images', 'original', fileName);
    const thumbnailPath = path.join(this.uploadPath, 'images', 'thumbnail', fileName);
    const mediumPath = path.join(this.uploadPath, 'images', 'medium', fileName);

    try {
      // Process and save original (max 2000px width, optimized)
      await sharp(file.path)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(originalPath);

      // Create thumbnail (400px)
      await sharp(file.path)
        .resize(400, 300, { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(thumbnailPath);

      // Create medium (800px)
      await sharp(file.path)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(mediumPath);

      // Clean up temp file
      await fs.unlink(file.path).catch(() => { });

      this.logger.log(`Image processed successfully: ${fileId}`);

      return {
        original: `/uploads/images/original/${fileName}`,
        thumbnail: `/uploads/images/thumbnail/${fileName}`,
        medium: `/uploads/images/medium/${fileName}`,
      };
    } catch (error) {
      this.logger.error('Image processing failed:', error);
      // Clean up any partial files
      await Promise.all([
        fs.unlink(originalPath).catch(() => { }),
        fs.unlink(thumbnailPath).catch(() => { }),
        fs.unlink(mediumPath).catch(() => { }),
        fs.unlink(file.path).catch(() => { }),
      ]);
      throw new BadRequestException('Failed to process image');
    }
  }

  async processMultipleImages(
    files: Express.Multer.File[],
  ): Promise<ProcessedImage[]> {
    const results: ProcessedImage[] = [];

    for (const file of files) {
      try {
        const processed = await this.processAndSaveImage(file);
        results.push(processed);
      } catch (error) {
        this.logger.error(`Failed to process file: ${file.originalname}`, error);
        // Continue with other files
      }
    }

    return results;
  }

  async deleteImage(imagePath: string): Promise<void> {
    if (!imagePath || !imagePath.startsWith('/uploads/images/')) {
      throw new BadRequestException('Invalid image path');
    }

    const fileName = path.basename(imagePath);
    const sizes = ['original', 'thumbnail', 'medium'];

    for (const size of sizes) {
      const fullPath = path.join(this.uploadPath, 'images', size, fileName);
      try {
        await fs.unlink(fullPath);
      } catch (error) {
        // File might not exist
      }
    }

    this.logger.log(`Deleted image: ${fileName}`);
  }
}
