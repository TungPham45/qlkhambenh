import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { StatisticalServiceModule } from './statistical-service.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    StatisticalServiceModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        retryAttempts: 5,
        retryDelay: 3000,
      },
    },
  );
  await app.listen();
  console.log('🚀 Statistical Microservice is listening via Redis...');
}
bootstrap();
