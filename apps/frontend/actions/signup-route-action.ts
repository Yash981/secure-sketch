"use server"

import axios from "axios"
import { UserAuthFormSchema } from "@repo/shared-schema";



export const signupRouteAction = async (data: UserAuthFormSchema) => {
    try {
        const response = await axios.post(`${process.env.BACKEND_URL}/api/v1/signup`, data)
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