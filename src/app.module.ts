import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from "./auth/auth.module";
import { PrivilegeModule } from './privilege/privilege.module';

// common
import { LoggerMiddleware } from "./common/logger.middleware";

// typeORM entity
import { UserEntity } from './user/entities/user.entity'
import { RoleEntity } from "./role/entities/role.entity";
import { PrivilegeEntity } from "./privilege/entities/privilege.entity";

@Module({
  imports: [
    UserModule, RoleModule, PrivilegeModule, AuthModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'rbac',
      entities: [ UserEntity, RoleEntity, PrivilegeEntity ],
      synchronize: false
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware)
      .forRoutes('*')
  }
}
