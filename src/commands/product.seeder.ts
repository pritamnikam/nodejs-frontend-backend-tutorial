import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

// ESM
import { Faker, es } from '@faker-js/faker';
import { ProductService } from 'src/product/product.service';
import { randomInt } from 'crypto';

// Run as standalone application in docker compose
// $ docker compose exec backend sh
// # npm run seed:products

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const productService = app.get(ProductService);

  for (let i = 0; i < 30; i++) {
    // create a Faker instance with only es data and no en fallback (=> smaller bundle size)
    const customFaker = new Faker({ locale: [es] });
    await productService.save({
      title: customFaker.lorem.words(2),
      description: customFaker.lorem.words(10),
      image: customFaker.image.imageUrl(200, 200, '', true),
      price: randomInt(10, 100),
    });
  }

  process.exit();
})();
