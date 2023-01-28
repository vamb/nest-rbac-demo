import { PrivilegeEntity } from "../entities/privilege.entity";

export class PaginationPrivilegeDto {
  list: PrivilegeEntity[]
  page: number
  size: number
  totalCount: number
}
