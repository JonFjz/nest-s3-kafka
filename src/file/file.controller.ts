import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Param,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import express from 'express';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file?.buffer || !file?.originalname || !file?.mimetype) {
      throw new BadRequestException('No file uploaded or invalid file');
    }

    return this.fileService.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
    );
  }

  @Get(':key')
  async getFile(@Param('key') key: string, @Res() res: express.Response) {
    try {
      const stream = await this.fileService.getFile(key);

      // Optional: set content type to application/octet-stream
      res.setHeader('Content-Type', 'application/octet-stream');

      // Handle streaming errors
      stream.on('error', (err) => {
        console.error('Stream error:', err);
        res.status(500).end('Error reading file');
      });

      stream.pipe(res);
    } catch (err) {
      console.error('File fetch error:', err);
      throw new NotFoundException('File not found');
    }
  }
}
