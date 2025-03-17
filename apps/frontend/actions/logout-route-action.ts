"use server";

import axios from "axios";
import { cookies } from "next/headers";

export const logoutRouteAction = async () => {
  const token = (await cookies()).get('token')?.value
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/v1/logout`,{},{
        withCredentials:true,
        headers:{
          Cookie:`token=${token}`
        }
      }
    );
    
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    (await cookies()).delete("token");
    
    return { success: true };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "An error occurred during logout",
      };
    } else {
      console.error("Unexpected error:", error);
      return {
        success: false,
        error: "An error occurred during logout",
      };
    }
  }
}; 