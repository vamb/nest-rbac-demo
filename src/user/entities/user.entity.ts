import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint", nullable: true, name: 'dept_id' })
  deptId: number;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'name' })
  name: string;

  @Column({ type: "varchar", length: 64, nullable: false, name: 'password' })
  password: string;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'email' })
  email: string;

  @Column({ type: "int", nullable: false, name: 'status', default: 1 })
  status: number;

  @Column({ type: "char", length: 11, nullable: true, name: 'mobile' })
  mobile: string;

  @Column({ type: "varchar", length: 1000, nullable: true, name: 'note' })
  note: string;

  @Column({ type: "int", nullable: false, name: 'deleted', default: 0 })
  deleted: number;

  @Column({ type: "datetime", nullable: false, name: 'create_time' })
  createTime: Date;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'create_by' })
  createBy: string;

  @Column({ type: "datetime", nullable: false, name: 'update_time' })
  updateTime: Date;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'update_by' })
  updateBy: string;

  @Column({ type: "int", nullable: false, name: 'sort', default: 0 })
  sort: number;
}
