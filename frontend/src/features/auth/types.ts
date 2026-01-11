export interface IBaseLoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface IAdminLoginResponse extends IBaseLoginResponse {
  user: IUser;
}

export interface ICandidateLoginResponse extends IBaseLoginResponse {
  seat: ISeat;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string;
  tenantName?: string;
  avatar?: string;
}

export interface IAdminMeResponse {
  user: IUser;
}

export interface ICandidateMeResponse {
  seat: ISeat;
}

export interface ISeat {
  id: string;
  sessionId: string;
  seatNumber: number;
  label: string;
  accessCode: string;
  candidateName: string;
  candidateId: string;
}

export enum AuthType {
  ADMIN = "admin",
  CANDIDATE = "candidate",
}
