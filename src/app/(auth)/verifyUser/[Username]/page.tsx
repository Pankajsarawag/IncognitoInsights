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
import { verifySchema } from '@/schemas/verifySchema';
import "./verifyUser.css"

export default function verifyUser() {
  const [isSending, setIsSending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const param = useParams<{ Username: string }>();
  const { toast } = useToast();
  const router = useRouter();

  const register = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      verificationCode: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/verifyCode',
        { username: param.Username, verifyCode: data.verificationCode });

      toast({
        title: 'Success',
        description: response.data.message,
        className:'toast-success'
      });
      router.push('/sign-in')
      setIsSubmitting(false);
    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      ('An error while verifying user. Please try again')

      toast({
        title: 'User verificatoin Failed',
        description: errorMessage,
        className:'toast-error'
      });
      setIsSubmitting(false);
    }
  }

  const resendCode = async () => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>('/api/resendCode', { username: param.Username });

      toast({
        title: 'Success',
        description: response.data.message,
        className:'toast-success',
      });

      setIsSending(false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      ('An error while sending verification code. Please try again')

      toast({
        title: 'Failed',
        description: errorMessage,
        className:'toast-error'
      });

      setIsSending(false);
    }
  }

  return (
    <div className="verifyUser">
      <div className="form-content">
        <div className="verifyUser-text">
          <h1>Verify Your Account</h1>
          <p>Enter 6 digit code that sent to your email</p>
        </div>
        <Form {...register} >
          <form onSubmit={register.handleSubmit(onSubmit)} className='form'>
            <FormField
              name="verificationCode"
              control={register.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='formLabel'>Verification Code <span style={{ color: "red" }}>*</span></FormLabel>
                  <Input className='formInput' placeholder="Verification Code" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="resend">
              <p>
                Didn't receive the code?</p>
                <a className='resendLink' href="#" onClick={(e) => { e.preventDefault(); resendCode(); }}>
                  {isSending ? (
                    <>
                      <Loader2 className='loader' />
                      Sending....
                    </>
                  ) : (
                    "Resend Code"
                  )}
                </a>
        
            </div>


            <Button className='button' type="submit">
              {isSubmitting ? (
                <>
                  <Loader2 className='loader' />
                  Please wait
                </>
              ) : (
                "Verify Your Account"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}