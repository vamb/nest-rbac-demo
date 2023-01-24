import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'privilege' })
export class PrivilegeEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint", nullable: true, name: 'pid' })
  pid: number;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'name' })
  name: string;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'code' })
  code: string;

  @Column({ type: "int", nullable: false, name: 'type', default: 1, comment: '类型,1:菜单,2:按钮' })
  type: number;

  @Column({ type: "varchar", length: 50, nullable: false, name: 'path' })
  path: string;

  @Column({ type: "int", nullable: true, name: 'sort', default: 0 })
  sort: number;

  @Column({ type: "varchar", length: 50, nullable: true, name: 'icon' })
  icon: string;

  @Column({ type: "datetime", nullable: true, name: 'create_time' })
  createTime: Date;

  @Column({ type: "varchar", length: 50, nullable: true, name: 'create_by' })
  createBy: string;

  @Column({ type: "datetime", nullable: true, name: 'update_time' })
  updateTime: Date;

  @Column({ type: "varchar", length: 50, nullable: true, name: 'update_by' })
  updateBy: string;

  @Column({ type: "int", nullable: true, name: 'level', default: 0 })
  level: number;
}
