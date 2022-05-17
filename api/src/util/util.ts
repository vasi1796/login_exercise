import * as crypto from 'crypto';

export function encrypt(stringToEncrypt: string) :
 string[] {
  let otpCipher: crypto.Cipher | undefined = undefined;
  let encryptedOtp: string | undefined = undefined;
  // Encrypt with aes
  const algorithm = 'aes-256-cbc';
  // generate 16 bytes of random data
  const otpIv = crypto.randomBytes(16);
  otpCipher = crypto.createCipheriv(
      algorithm,
        process.env.TOTP_SECRET as string,
        otpIv);
  encryptedOtp = otpCipher.update(stringToEncrypt, 'utf-8', 'hex');
  encryptedOtp += otpCipher.final('hex');
  return [encryptedOtp, otpIv.toString('base64')];
}
