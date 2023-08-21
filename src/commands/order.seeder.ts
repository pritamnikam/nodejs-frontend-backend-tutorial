import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';

// ESM
import { Faker, es } from '@faker-js/faker';
import { OrderService } from 'src/order/order.service';
import { OrderItemService } from 'src/order/order-item.service';
import { randomInt } from 'crypto';

// Run as standalone application in docker compose
// $ docker compose exec backend sh
// # npm run seed:orders

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const orderServcie = app.get(OrderService);
  const orderItemServcie = app.get(OrderItemService);

  for (let i = 0; i < 30; i++) {
    // create a Faker instance with only es data and no en fallback (=> smaller bundle size)
    const customFaker = new Faker({ locale: [es] });
    const order = await orderServcie.save({
      user_id: randomInt(2, 31),
      code: customFaker.lorem.slug(2),
      ambassador_email: customFaker.internet.email(),
      first_name: customFaker.person.firstName(),
      last_name: customFaker.person.lastName(),
      email: customFaker.internet.email(),
      complete: true,
    });

    for (let j = 0; j < randomInt(1, 5); j++) {
      await orderItemServcie.save({
        order,
        product_title: customFaker.lorem.words(2),
        price: randomInt(10, 100),
        quantity: randomInt(1, 5),
        admin_revenue: randomInt(10, 100),
        ambassador_revenue: randomInt(1, 10),
      });
    }
  }

  process.exit();
})();
