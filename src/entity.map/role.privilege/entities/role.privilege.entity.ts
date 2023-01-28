import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'role_privilege' })
export class RolePrivilegeEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint", nullable: false, name: 'role_id' })
  roleId: number;

  @Column({ type: "bigint", nullable: false, name: 'privilege_id' })
  privilegeId: number;

}
