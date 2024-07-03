'use client';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { messageSchema } from '@/schemas/messageSchema';
import { useParams } from 'next/navigation';
import { ApiResponse } from '@/types/ApiResponse';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Loader2, Send, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import"./sendMessage.css";
import { useState } from 'react';
import { set } from 'mongoose';

export default function sendMessage() {
    const { toast } = useToast();
    const param = useParams<{ username: string }>();

    const [isSending, setIsSending] = useState<boolean>(false);

    const register = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        mode: 'onChange',
        defaultValues: {
            message: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsSending(true);
        try {
            const response = await axios.post(`/api/sendMessage`, {
                username: param.username,
                content: data.message,
            });

            toast({
                title: response.data.success ? 'Message Sent' : 'Message Failed',
                description: response.data.message,
                className: response.data.success ? 'toast-success' : 'toast-error',
            });

            setIsSending(false);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: 'Failed to send message',
                description: errorMessage,
                className: 'toast-error',
            });

            setIsSending(false);
        }
    }
    return (
        <div className="sendMessage">
            <div className="form-content">
                <div className="sendMessage-text">
                    <h1>Send a message to {param.username}</h1>
                </div>
                <Form {...register} >
                    <form onSubmit={register.handleSubmit(onSubmit)} className='form'>
                        <FormField
                            name="message"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem style={{display:"flex", flexDirection:"column"}}>
                                    <FormLabel className='formLabel'>Your Message<span style={{ color: "red" }}>*</span></FormLabel>
                                    <textarea className='formInput' placeholder="Write your message here..." {...field} />
                                    <FormMessage className='formMessage' />
                                </FormItem>
                            )}
                        />

                        <Button className='button' type="submit">
                            {isSending ? <><Loader2 className='loader' /> Sending</> : <>
                            <SendHorizonal className='sendIcon' /> Send</>}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}