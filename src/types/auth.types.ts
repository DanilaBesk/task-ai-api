export type TCheckPassword = {
  password: string;
  passwordHash: string;
};

export type TMakeHashPassword = {
  password: string;
};

export type TRegistration = {
  email: string;
  password: string;
};

export type TLogin = {
  email: string;
  password: string;
};

export type TLogout = {
  userId: string;
};

export type TRefreshTokens = {
  refreshToken: string;
};
