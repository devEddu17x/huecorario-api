import { registerAs } from '@nestjs/config';

export default registerAs('bcrypt', () => {
  const { ROUNDS } = process.env;
  return {
    rounds: ROUNDS ? parseInt(ROUNDS, 10) : 10,
  };
});
