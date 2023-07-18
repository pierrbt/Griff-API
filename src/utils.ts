export function generateRandomString(length: number = 80): string {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export const jwtSecret = "1kU2X5YvZverkX1PiZ7TlHeMBcjnYFLTb4cKqi1cHyzzhARappD2r8LG765mdEuj";