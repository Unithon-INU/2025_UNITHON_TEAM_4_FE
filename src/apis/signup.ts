import client, { getApiUrl } from "./client";

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

const signup = async ({ name, email, password }: SignupRequest): Promise<void> => {
  const fixedPayload = {
    name,
    email,
    password,
    phone: "01012345678", // ✅ 프론트에서 고정값으로 보냄
    profileImageUrl: "string", // ❗ 필요 없으면 공란으로
    role: "USER",
  };

  await client.post(getApiUrl("/auth/signup"), fixedPayload);
};

export default signup;
