import { registerAs } from '@nestjs/config';

export default registerAs('app', () => {
  const { NODE_ENV } = process.env;

  return {
    environment: NODE_ENV || 'development',
  };
});
