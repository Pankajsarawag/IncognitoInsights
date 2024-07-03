'use client'
import React from 'react';
import axios, { AxiosError } from 'axios';
import { Message } from '@/model/User';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { useSession } from 'next-auth/react';
import { User } from 'next-auth';
import dayjs from 'dayjs';
import "./MessageCard.css";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from '@react-email/components';
import { X } from 'lucide-react';


type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
  onClick: () => void;
};

export function MessageCard({ message, onMessageDelete, onClick }: MessageCardProps) {
  const { toast } = useToast();

  const session = useSession();
  const user: User = session.data?.user as User;

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        '/api/deleteMessage', {
        data: {
          userId: user._id,
          messageId: message._id
        }
      }
      );
      toast({
        title: response.data.message,
        className:'toast-success',
      });
      onMessageDelete(message._id as string);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message ?? 'Failed to delete message',
        className:'toast-error',
      });
    }
  };

  return (
    <Card onClick={onClick} className='Card' >
      <CardHeader className='CardHeader'>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button className='Button'>
              <X/>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='alert-dialog-content'>
            <AlertDialogHeader className='alert-dialog-header'>
              <AlertDialogTitle className='alert-dialog-title'>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className='alert-dialog-description'>
                This action cannot be undone. This will permanently delete your message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className='alert-dialog-footer'>
              <AlertDialogCancel className='alert-dialog-cancel'>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className='alert-dialog-action'
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteConfirm();
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


      </CardHeader>
      <CardContent className='CardContent'>
        {message.content.slice(0, 20)}...
      </CardContent>
      <CardFooter className="CardFooter">
        {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
      </CardFooter>
    </Card>
  );
}
