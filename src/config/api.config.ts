import { registerAs } from '@nestjs/config';

export default registerAs('api', () => {
  const { PORT } = process.env;
  return {
    port: PORT ? parseInt(PORT, 10) : 8000,
  };
});
