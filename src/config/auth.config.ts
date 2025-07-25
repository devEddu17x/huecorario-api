import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
  const {
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    JWT_EXPIRES_IN,
    JWT_REFRESH_EXPIRES_IN,
    SALT_ROUNDS,
  } = process.env;

  return {
    secret: JWT_SECRET,
    refreshSecret: JWT_REFRESH_SECRET,
    expiresIn: JWT_EXPIRES_IN,
    refreshExpiresIn: JWT_REFRESH_EXPIRES_IN,
    rounds: parseInt(SALT_ROUNDS, 10),
  };
});
