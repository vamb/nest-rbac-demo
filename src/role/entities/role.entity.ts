import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'role' })
export class RoleEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'code' })
  code: string;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'name' })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'description' })
  description: string;

  @Column({ type: "datetime", nullable: false, name: 'create_time' })
  createTime: Date;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'create_by' })
  createBy: string;

  @Column({ type: "datetime", nullable: false, name: 'update_time' })
  updateTime: Date;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'update_by' })
  updateBy: string;
}
