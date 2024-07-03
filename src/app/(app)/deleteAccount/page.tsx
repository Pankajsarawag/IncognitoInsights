'use client';
import { useSession } from "next-auth/react";
import { User } from "next-auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import Link from "next/link";
import "./deleteAccount.css"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";


export default function DeleteAccount() {
    const { data: session } = useSession();
    const user: User | undefined = session?.user as User | undefined;
    const [inputUsername, setInputUsername] = useState("");
    const [inputPassword, setInputPassword] = useState("");
    const [confirmingUsername, setConfirmingUsername] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPasswordErrorAlert, setShowPasswordErrorAlert] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const router = useRouter();

    const handleConfirmUsername = () => {
        if (inputUsername === user?.username) {
            setConfirmingUsername(true);
        } else {
            setErrorMessage("Incorrect username. Please try again.");
            setShowErrorAlert(true);
        }
    };

    const handleDeleteAccount = async () => {
        try {
            const response = await axios.delete<ApiResponse>('api/deleteAccount', {
                data: {
                    userId: user?._id,
                    password: inputPassword
                }
            });

            toast({
                title: response.data.success ? 'Account Deleted' : 'Failed to delete account',
                description: response.data.message,
                className: response.data.success ? 'toast-success' : 'toast-error'
            })

            router.push('/');
        } catch (error) {
            setPasswordErrorMessage("Failed to delete account. Please check your password and try again.");
            setShowPasswordErrorAlert(true);
        }
    };

    const handleCloseErrorAlert = () => {
        setShowErrorAlert(false);
    };

    const handleClosePasswordErrorAlert = () => {
        setShowPasswordErrorAlert(false);
    };

    return (
        <div className="deleteAccount">
            <div className="deleteAccount-content">
                <h1>Delete Account</h1>
                {user ? (
                    <>
                        {!confirmingUsername ? (
                            <>
                                <Input
                                    className="deleteAccount-Input"
                                    type="text"
                                    placeholder="Enter your username"
                                    value={inputUsername}
                                    onChange={(e) => setInputUsername(e.target.value)}
                                />
                                <Button className="button-click" onClick={handleConfirmUsername}>Confirm Username</Button>
                            </>
                        ) : (
                            <>
                                <Input
                                    className="deleteAccount-Input"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={inputPassword}
                                    onChange={(e) => setInputPassword(e.target.value)}
                                />
                                <Button className="button-click" onClick={handleDeleteAccount}>Delete Account</Button>
                            </>
                        )}
                    </>
                ) : (
                    <div style={{display:"flex", flexDirection:"row", color:"white"}}>
                        <p>Log in to delete your account</p>
                        <p>
                        <Link href="sign-in" style={{color:"blue", marginLeft:5}}>
                            Login
                        </Link>
                        </p>
                    </div>
                )}

                <AlertDialog open={showErrorAlert} onOpenChange={handleCloseErrorAlert}>
                    <AlertDialogContent className='alert-dialog-content'>
                        <AlertDialogHeader className='alert-dialog-header'>
                            <AlertDialogDescription className='alert-dialog-description'>
                                {errorMessage}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='alert-dialog-footer'>
                            <AlertDialogAction className='alert-dialog-confirm' onClick={handleCloseErrorAlert}>Try again</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={showPasswordErrorAlert} onOpenChange={handleClosePasswordErrorAlert}>
                <AlertDialogContent className='alert-dialog-content'>
                <AlertDialogHeader className='alert-dialog-header'>
                <AlertDialogDescription className='alert-dialog-description'>
                                {passwordErrorMessage}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className='alert-dialog-footer'>
                            <AlertDialogAction className='alert-dialog-confirm' onClick={handleClosePasswordErrorAlert}>Try again</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}
