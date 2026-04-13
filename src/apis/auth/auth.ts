import api from "../axiosInstance";

export interface SignUpRequest {
  email: string;
  walletAddress: string;
  name: string;
}

export const signup = async (signUpData: SignUpRequest) => {
  const { data } = await api.post("/auth/signup/request", signUpData);
  return data;
};