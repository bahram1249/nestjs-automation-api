import { Transaction } from 'sequelize';

export class AddUserOrganizationRoleDto {
  organizationId: number;
  userId: bigint;
  roleId: number;
  transaction?: Transaction;
}
