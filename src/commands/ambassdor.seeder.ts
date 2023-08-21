import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { UserService } from 'src/user/user.service';

// ESM
import { Faker, es } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';

// Run as standalone application in docker compose
// $ docker compose exec backend sh
// # npm run seed:ambassadors

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);

  const password = await bcrypt.hash('1234', 12);

  for (let i = 0; i < 30; i++) {
    // create a Faker instance with only es data and no en fallback (=> smaller bundle size)
    const customFaker = new Faker({ locale: [es] });
    await userService.save({
      first_name: customFaker.person.firstName(),
      last_name: customFaker.person.lastName(),
      email: customFaker.internet.email(),
      password,
      is_ambassador: true,
    });
  }

  process.exit();
})();
