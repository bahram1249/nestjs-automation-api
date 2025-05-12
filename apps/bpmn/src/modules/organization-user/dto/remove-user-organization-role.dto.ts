import { Transaction } from 'sequelize';

export class RemoveUserOrganizationRoleDto {
  organizationId: number;
  userId: bigint;
  roleId: number;
  transaction?: Transaction;
}
