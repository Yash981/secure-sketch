"use server"

import axios from "axios"
import https from 'https';
import { UserAuthFormSchema } from "@repo/shared-schema";

const agent = new https.Agent({  
    rejectUnauthorized: false
});

export const signupRouteAction = async (data: UserAuthFormSchema) => {
    try {
        const response = await axios.post(`${process.env.BACKEND_URL}/api/v1/signup`, data,{ httpsAgent: agent } )
        return { success: true, data: response.data };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data || error.message)
            return { success: false, error: error.response?.data?.message || 'An error occurred during signup' };
        } else {
            return { success: false, error: error || 'An error occurred during signup' };
        }
    }
}