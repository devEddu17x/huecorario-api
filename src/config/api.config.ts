import { registerAs } from '@nestjs/config';

export default registerAs('api', () => {
  const { API_PORT } = process.env;
  return {
    port: API_PORT,
  };
});
