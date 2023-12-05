import axios from "axios";
import { SiweMessage } from "siwe";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

class ApiService {
  private readonly apiInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
    headers: {
      "content-type": "application/json;charset=UTF-8",
      accept: "application/json,",
    },
  });

  async createWallet(address: string) {
    await this.apiInstance.post(`/wallet?address=${address}`);
  }

  async fetchNonce(address: string): Promise<string> {
    const nonceRes = await this.apiInstance.get(
      `/auth/nonce?address=${address}`
    );
    const nonce = nonceRes.data.nonce as string;
    return nonce;
  }

  async signWallet(
    message: SiweMessage,
    signature: string
  ): Promise<AuthTokens> {
    const signRes = await this.apiInstance.post("/auth/sign", {
      message,
      signature,
    });

    const tokens = signRes.data.authTokens as AuthTokens;
    return tokens;
  }
}

export const apiService = new ApiService();
