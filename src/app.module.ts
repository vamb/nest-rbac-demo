import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { AuthModule } from "./auth/auth.module";
import { PrivilegeModule } from './privilege/privilege.module';
import { RolePrivilegeModule } from './entity.map/role.privilege/role.privilege.module';

// common
import { LoggerMiddleware } from "./common/logger.middleware";

// typeORM entity
import { UserEntity } from './user/entities/user.entity'
import { RoleEntity } from "./role/entities/role.entity";
import { PrivilegeEntity } from "./privilege/entities/privilege.entity";
import { RolePrivilegeEntity } from './entity.map/role.privilege/entities/role.privilege.entity'


@Module({
  imports: [
    UserModule, RoleModule, PrivilegeModule, AuthModule,RolePrivilegeModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'vamb',
      database: 'rbac',
      entities: [ UserEntity, RoleEntity, PrivilegeEntity, RolePrivilegeEntity ],
      cache: true,
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
