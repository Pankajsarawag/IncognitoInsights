'use client'
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import axios, { AxiosError } from 'axios';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useDebounceCallback } from 'usehooks-ts';
import "./signUp.css"

export default function SignUpForm() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();
    const { toast } = useToast();

    const debounced = useDebounceCallback(setUsername, 500);

    const register = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            password: '',
            passwordConfirmation: '',
        },
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const response = await axios.get<ApiResponse>(
                        `/api/check-username-unique?username=${username}`
                    );
                    setUsernameMessage(response.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(
                        axiosError.response?.data.message ?? "An error occurred while checking username uniqueness"
                    );
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        };
        checkUsernameUnique();
    }, [username]);

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        setUsernameMessage('');
        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);

            toast({
                title: 'Success',
                description: response.data.message,
                className:"toast-success "
            });

            router.replace(`/verifyUser/${data.username}`);

            setIsSubmitting(false);
        } catch (error) {
            // console.error('Error during sign-up:', error);

            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            ('An error occurred while signing up. Please try again.');

            toast({
                title: 'Sign Up Failed',
                description: errorMessage,
                className:"toast-error"
            });

            setIsSubmitting(false);
        }
    };


    return (
        <div className="signUp">
            <div className="form-content">
                <div className="signUp-text">
                    <h1>Join Incognito Insights</h1>
                    <p>Sign up to create an account</p>
                </div>
                <Form {...register}>
                    <form onSubmit={register.handleSubmit(onSubmit)} className='form'>
                        <FormField
                            name="firstName"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem className='formItem'>
                                    <FormLabel className='formLabel'>First Name <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input className='formInput' placeholder="First Name" {...field} />
                                    <FormMessage className='formMessage' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="lastName"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem className='formItem'>
                                    <FormLabel className='formLabel'>Last Name</FormLabel>
                                    <Input className='formInput' placeholder="Last Name" {...field} />
                                    <FormMessage className='formMessage' />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="username"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem className='formItem'>
                                    <FormLabel className='formLabel'>Username <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input
                                        className='formInput'
                                        placeholder="Username"
                                        {...field}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            debounced(e.target.value);
                                        }}
                                    />
                                    {isCheckingUsername &&
                                        <Loader2 className="checkUsername-loader loader" />}
                                    {!isCheckingUsername &&
                                        usernameMessage && (
                                            <>
                                                {usernameMessage === "Username must be at least 2 characters long" ? (
                                                    <FormMessage className='formMessage'/>
                                                ) : (
                                                    <p className={`${usernameMessage === "Username is unique" ? "message-text-green" : "message-text-red"}`}>
                                                        {usernameMessage}
                                                    </p>
                                                )}
                                            </>
                                        )
                                    }

                                    {!isCheckingUsername && !usernameMessage && (
                                        <FormMessage className='formMessage'/>
                                    )}


                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem className='formItem'>
                                    <FormLabel className='formLabel'>Email <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input className='formInput' placeholder="Email" {...field} />
                                    <FormMessage className='formMessage'/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem className='formItem'>
                                    <FormLabel className='formLabel'>Password <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input className='formInput' placeholder="Password" type="password" {...field} />
                                    <FormMessage className='formMessage'/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="passwordConfirmation"
                            control={register.control}
                            render={({ field }) => (
                                <FormItem className='formItem'>
                                    <FormLabel className='formLabel'>Confirm Password <span style={{ color: "red" }}>*</span></FormLabel>
                                    <Input className='formInput' placeholder="Confirm Password" type="password" {...field} />
                                    <FormMessage className='formMessage' />
                                </FormItem>
                            )}
                        />
                        <Button className='button' type="submit">
                            {isSubmitting ? (
                                <>
                                    <Loader2 className='loader' />
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </Button>
                    </form>
                </Form>
                <div className='signIn'>
                    <p>
                        Already have an account? <Link className='signInLink' href="/sign-in">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
