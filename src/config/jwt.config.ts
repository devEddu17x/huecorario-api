import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => {
  const {
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
  } = process.env;

  return {
    accessSecret: JWT_SECRET,
    refreshSecret: JWT_REFRESH_SECRET,
    accessExpiresIn: JWT_EXPIRES_IN,
    refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
  };
});
