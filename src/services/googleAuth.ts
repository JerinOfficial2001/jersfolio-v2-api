import { OAuth2Client } from "google-auth-library";
import axios from "axios";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (accessToken: string) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error("Missing GOOGLE_CLIENT_ID environment variable");
    }

    const tokenInfo = await client.getTokenInfo(accessToken);

    // Fetch user profile information
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const profile = response.data;

    return {
      ...tokenInfo,
      name: profile.name,
      picture: profile.picture,
    };
  } catch (error) {
    console.error("Error verifying Google access token:", error.message);
    return null;
  }
};
