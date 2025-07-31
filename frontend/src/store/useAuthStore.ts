import axiosInstance from '@/lib/axiosInstance';
import type { loginSchema, signupSchema } from '@/zod/authSchema';
import axios from 'axios';
import toast from 'react-hot-toast';
import type { z } from 'zod';
import { create } from 'zustand'

type userType = {
    id: string;
    username: string;
    fullname: string;
    profilePic: string | null;
}

export type AuthStore = {
    user : userType | null;
    setUser: (user: userType | null) => void;

    isChecking: boolean;
    setIsChecking: (isChecking: boolean) => void;
    isSubmitting: boolean;
    setIsSubmitting: (isSubmitting: boolean) => void;

    signup: (formData: z.infer<typeof signupSchema>) => Promise<boolean>;
    login: (formData: z.infer<typeof loginSchema>) => Promise<boolean>;
    check: (token: string) => Promise<boolean>;
}

const useAuthStore = create((set) => ({
    // user details
    user: null,
    setUser: (user: userType | null) => set({ user }),

    isChecking: false,
    setIsChecking: (isChecking: boolean) => set({isChecking}),
    isSubmitting: false,
    setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),

    signup: async (formData: z.infer<typeof signupSchema>): Promise<boolean> => {
        set({ isSubmitting: true });
        try {
            const res = await axiosInstance.post('/auth/signup', formData, {
                timeout: 60000 // 60 seconds
            })
            if (res.status == 201) {
                // success
                set({ isSubmitting: false });
                return true;
            }
            return false;
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data?.error) {
                    toast.error(err.response.data.error);
                    set({ isSubmitting: false });
                    return false;
                }
                toast.error(err.message);
            }
        }
        set({ isSubmitting: false });
        return false;
    },
    login: async (formData: z.infer<typeof loginSchema>): Promise<boolean> => {
        set({ isSubmitting: true });
        try {
            const res = await axiosInstance.post('/auth/login', formData, {
                timeout: 60000 // 60 seconds
            })
            if (res.status == 200) {
                // success
                localStorage.setItem('token', "Bearer "+res.data.token);
                set({ isSubmitting: false, user: res.data.user });
                return true;
            }
            return false;
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data?.error) {
                    toast.error(err.response.data.error);
                    set({ isSubmitting: false });
                    return false;
                }
                toast.error(err.message);
            }
        }
        set({ isSubmitting: false });
        return false;
    },
    check : async (token: string): Promise<boolean> => {
        set({ isChecking: true });
        try {
            const res = await axiosInstance.post('/auth/check', { token }, {
                timeout: 30000 // 30 seconds
            });
            if (res.status == 200) {
                // success
                set({ isChecking: false, user: res.data.user });
                return true;
            }
            return false;
        }
        catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.data?.error) {
                    toast.error(err.response.data.error);
                    set({ isChecking: false });
                    return false;
                }
                toast.error(err.message);
            }
        }
        set({ isChecking: false });
        return false;
    }
}));

export default useAuthStore;