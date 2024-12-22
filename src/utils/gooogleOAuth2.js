import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import createHttpError from 'http-errors';
dotenv.config();

const googleOAuth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
});

export function generateOauthUrl() {
  return googleOAuth2Client.generateAuthUrl({
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  });
}

export async function validateCode(code) {
  try {
    const res = await googleOAuth2Client.getToken(code);
    console.log('Token response:', res);

    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: res.tokens.id_token,
    });
    console.log('ID Token verification result:', ticket);

    return ticket;
  } catch (error) {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 499
    ) {
      throw createHttpError(401, 'Unauthorized');
    }
    throw createHttpError(401, 'Invalid');
  }
}
