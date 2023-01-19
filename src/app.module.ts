import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PrivilegeModule } from './privilege/privilege.module';

// typeORM entity
import { UserEntity } from './user/entities/user.entity'
import { RoleEntity } from "./role/entities/role.entity";
import { PrivilegeEntity } from "./privilege/entities/privilege.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'rabc',
      entities: [ UserEntity, RoleEntity, PrivilegeEntity ],
      synchronize: false
    }),
    UserModule,
    RoleModule,
    PrivilegeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
