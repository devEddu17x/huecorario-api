import { registerAs } from '@nestjs/config';

export default registerAs('api', () => {
  const { PORT, ORIGIN, DOMAIN } = process.env;
  return {
    port: PORT ? parseInt(PORT, 10) : 8000,
    origin: ORIGIN ? ORIGIN.split(',') : ['http://localhost:3000'],
    domain: DOMAIN,
  };
});
