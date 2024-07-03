'use client';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { resetPasswordSchema } from '@/schemas/resetPasswordSchema';
import './resetPassword.css'; 

export default function ResetPassword() {
    const param = useParams<{ Username: string }>();

    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const register = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        mode: 'onChange',
        defaultValues: {
            newPassword: '',
            newPasswordConfirmation: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post<ApiResponse>('/api/changePassword', {
                username: param.Username,
                newPassword: data.newPassword,
            });
            
            setIsLoading(false);

            toast({
                title: 'Success',
                description: response.data.message,
                className: 'toast-success',
            });
            router.push('/sign-in');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message ?? 'An error occurred';
            toast({
                title: 'Error',
                description: errorMessage,
                className: 'toast-error',
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="resetPassword">
            <div className="form-content">
                <div className="resetPassword-text">
                    <h1>Incognito Insights</h1>
                    <p>Enter your new password</p>
                </div>
                <Form {...register}>
                    <form onSubmit={register.handleSubmit(onSubmit)} className="form">
                        <FormField
                            name="newPassword"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="formLabel">New Password <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input className="formInput" placeholder="New Password" type="password" {...field} />
                                    <FormMessage className="formMessage" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="newPasswordConfirmation"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="formLabel">Confirm New Password <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input className="formInput" placeholder="Confirm New Password" type="password" {...field} />
                                    <FormMessage className="formMessage" />
                                </FormItem>
                            )}
                        />
                        <Button className="button" type="submit">
                            {isLoading ? <Loader2 className="loader" /> : 'Change Password'}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
