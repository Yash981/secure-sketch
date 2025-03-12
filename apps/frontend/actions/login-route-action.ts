"use server";

import axios from "axios";
import { cookies } from "next/headers";
import https from 'https';
import { UserAuthFormSchema } from "@repo/shared-schema";
const agent = new https.Agent({  
    rejectUnauthorized: false
});
export const LoginRouteAction = async (data: UserAuthFormSchema) => {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/v1/signin`,
      data,
      {httpsAgent:agent}
    );
    const result = await response.data;
    if (response && response.status !== 200) {
      throw new Error(response.statusText);
    }
    const setCookieHeader = response.headers["set-cookie"];
    if (setCookieHeader) {
      (await cookies()).set({
        name: "token",
        value: setCookieHeader[0].split(";")[0].split("=")[1],
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
    }
    return { success: true, data: result };
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      return {
        success: false,
        error:
          error.response?.data?.message || "An error occurred during login",
      };
    } else {
      console.error("Unexpected error:", error);
      return {
        success: false,
        error: error || "An error occurred during login",
      };
    }
  }
};
