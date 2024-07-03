'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';
import "./signIn.css"
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SignIN() {
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const register = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsLoading(true)
        const result = await signIn('credentials',
            {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            }
        );

        if (result?.error) {
            toast({
                title: 'Sign In Failed',
                description: 'Invalid Email/Username or Password',
                className: "toast-error"
            });
            setIsLoading(false)
        }

        if (result?.url) {
            setIsLoading(false)
            router.replace('./dashboard')
        }
    }

    return (
        <div className="signIn">
            <div className="form-content">
                <div className="signIn-text">
                    <h1>SignIn Incognito Insights</h1>
                </div>
                <Form {...register}>
                    <form onSubmit={register.handleSubmit(onSubmit)} className='form'>
                        <FormField
                            name="identifier"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem className='formItem'>
                                    <FormLabel className='formLabel'>Email or Username <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input className="formInput" placeholder="Email or Username" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            name="password"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem className='formItem'>
                                    <FormLabel className='formLabel'>Password <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input className="formInput" placeholder="Password" type="password" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Link href="/forgot-password" className="forgotPassword">
                            Forgot Password?
                        </Link>

                        <Button className='button' type="submit">
                            {isLoading ? (
                                <Loader2 className='loader' />
                            ) : ("Sign In")}
                        </Button>
                    </form>
                </Form>
                <div className="signUp">
                    <p>Already have an account? <Link href="sign-up" className="signUpLink"> Sign Up</Link></p>
                </div>

            </div>
        </div>
    )
}
