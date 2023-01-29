import { PaginationDto } from "../dto/pagination.dto";

export const getSkippedItems = (paginationDto: PaginationDto) => {
  return (paginationDto.page - 1) * paginationDto.size
}
