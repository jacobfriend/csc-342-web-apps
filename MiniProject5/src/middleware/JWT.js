const crypto = require('crypto');
const { Buffer } = require('buffer');

class CustomJWT {
  constructor(secret) {
    if (!secret) {
      throw new Error('API_SECRET is required');
    }
    this.secret = secret;
  }

  sign(payload) {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };

    const encodedHeader = this.base64urlEncode(JSON.stringify(header));
    const encodedPayload = this.base64urlEncode(JSON.stringify(payload));
    const signature = this.createSignature(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  verify(token) {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    // Validate signature
    const isSignatureValid = this.verifySignature(encodedHeader, encodedPayload, signature);
    if (!isSignatureValid) {
      throw new Error('Invalid signature');
    }

    // Decode and parse payload
    const payload = JSON.parse(this.base64urlDecode(encodedPayload));

    // Validate expiration
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTimestamp) {
      throw new Error('Token expired');
    }

    return payload;
  }

  createSignature(encodedHeader, encodedPayload) {
    const data = `${encodedHeader}.${encodedPayload}`;
    return crypto
      .createHmac('sha256', this.secret)
      .update(data)
      .digest('base64url');
  }

  verifySignature(encodedHeader, encodedPayload, signature) {
    const expectedSignature = this.createSignature(encodedHeader, encodedPayload);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  base64urlEncode(string) {
    return Buffer.from(string, 'utf8').toString('base64url');
  }

  base64urlDecode(string) {
    return Buffer.from(string, 'base64url').toString('utf8');
  }
}

module.exports = CustomJWT;