import {
  GSAddress,
  GSAssignedGuarantee,
  GSBrand,
  GSCity,
  GSGuarantee,
  GSGuaranteeConfirmStatus,
  GSGuaranteeOrganization,
  GSGuaranteeOrganizationContract,
  GSGuaranteePeriod,
  GSGuaranteeType,
  GSNeighborhood,
  GSProductType,
  GSProvider,
  GSProvince,
  GSVariant,
} from '../models';

export const guaranteeModels = [
  GSProvider,
  GSBrand,
  GSGuarantee,
  GSGuaranteeConfirmStatus,
  GSGuaranteePeriod,
  GSGuaranteeType,
  GSProductType,
  GSVariant,
  GSAssignedGuarantee,
  GSProvince,
  GSCity,
  GSNeighborhood,
  GSAddress,
  GSGuaranteeOrganization,
  GSGuaranteeOrganizationContract,
];
