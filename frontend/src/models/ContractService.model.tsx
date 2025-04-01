export interface ContractServiceModel {
  id?: number;
  serviceId: number;
  schedulerUserId?: number;
  appointmentDate: string;
  obs?: string;
  approved?: boolean;
  userProvider?: string;
  userScheduler?: string;
  average?: string;
}
