'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { forgotPasswordSchema } from '@/schemas/forgotPasswordSchema';
import "./forgot-password.css"
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function forgotPassword() {
    const [isSending, setIsSending] = useState<boolean>(false)
    const { toast } = useToast();
    const router = useRouter();

    const register = useForm<z.infer<typeof forgotPasswordSchema>>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            identifier: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
        const resetdomain = `${window.location.protocol}//${window.location.host}/reset-password`;
        setIsSending(true)
        try {
            const response = await axios.post('/api/forgotPassword', {
                username: data.identifier,
                email: data.identifier,
                resetdomain
            });

            toast({
                title: 'Success',
                description: response.data.message,
                className: 'toast-success'
            });
            
            setIsSending(false)
            
            router.replace('sign-in')
        } catch (error) {
            const exiosError = error as AxiosError<ApiResponse>;
            let errorMessage = exiosError.response?.data.message;
            toast({
                title: 'Error',
                description: errorMessage,
                className: 'toast-error'
            });
            setIsSending(false)
        }
    }
    return (
        <div className="forgotPassword">
            <div className="form-content">
                <div className="forgotPassword-text">
                    <h1>Forgot Password</h1>
                    <p>Enter your email or username to reset your password</p>
                </div>
                <Form {...register}>
                    <form onSubmit={register.handleSubmit(onSubmit)} className='form'>
                        <FormField
                            name="identifier"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='formLabel'>Email or Username <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input className='formInput' placeholder="Email or Username" {...field} />
                                    <FormMessage className='formMessage'/>
                                </FormItem>
                            )}
                        />

                        <Button className='button' type="submit">
                            {isSending ? (
                                <Loader2 className='loader' />
                            ) : ("Send Link")}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}