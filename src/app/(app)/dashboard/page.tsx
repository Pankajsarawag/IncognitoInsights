'use client';
import { useState, useEffect, useCallback } from 'react';
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema';
import { useSession } from 'next-auth/react';
import { toast, useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import * as z from 'zod';
import { User } from 'next-auth';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { Message } from '@/model/User';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { MessageCard } from '@/components/MessageCard/MessageCard';
import { Loader2, RefreshCcw } from 'lucide-react';
import { UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import "./dashboard.css";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

export default function Dashboard() {
  const [switching, setSwitching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessageContent, setSelectedMessageContent] = useState<string | null>(null);
  const [results, setResults] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');


  const { toast } = useToast();
  const { data: session } = useSession();
  const user: User = session?.user as User;

  const Router = useRouter();


  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
    if (selectedMessageContent && messages.find((message) => message._id === messageId)?.content === selectedMessageContent) {
      setSelectedMessageContent(null);
    }
  };

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchMessageStatus = useCallback(async () => {
    setSwitching(true);
    try {
      const response = await axios.post<ApiResponse>('/api/AcceptMessageStatus', { username: user?.username });
      setValue('acceptMessages', response.data.isAnonymous || false);
      console.log(response.data.isAnonymous);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Failed to fetch message status',
        description: axiosError.response?.data.message || 'An error occurred',
        className: 'toast-error',
      });
    } finally {
      setSwitching(false);
    }
  }, [setValue, toast, user?.username]);

  const changeMessageStatus = async (checked: boolean) => {
    setSwitching(true);
    try {
      await axios.post<ApiResponse>('/api/AcceptMessageSwitch', {
        username: user?.username,
        isAnonymous: checked
      });

      toast({
        title: 'Message status updated',
        description: `You are now ${checked ? 'accepting' : 'not accepting'} messages from other users`,
        className: "toast-success"
      });
      setValue('acceptMessages', checked);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Failed to update message status',
        description: axiosError.response?.data.message || 'An error occurred',
        className: 'toast-error',
      });
    } finally {
      setSwitching(false);
    }
  }

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/getMessage', { username: user?.username });
      console.log(response.data);
      if (response.data.success === true) {
        setMessages(response.data.messages || []);
        console.log(response.data.messages);
      } else {
        toast({
          title: 'Failed to fetch messages',
          description: response.data.message,
          className: 'toast-error',
        });
      }

      if (refresh) {
        toast({
          title: 'Messages refreshed',
          description: 'Showing latest messages',
          className: 'toast-success',
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Failed to fetch messages',
        description: axiosError.response?.data.message || 'An error occurred',
        className: 'toast-error',
      });
    } finally {
      setLoading(false);
    }
  }, [setMessages, toast, user?.username]);

  useEffect(() => {
    if (user?.username) {
      fetchMessageStatus();
      fetchMessages();
    }
  }, [fetchMessageStatus, fetchMessages, user?.username]);


  const handleSearch = async (searchTerm: string) => {
    if (searchTerm === '') {
      setResults([]);
      return;
    }

    try {
      const response = await axios.post('api/searchUsername', {
        keyword: searchTerm
      });

      if (response.data.length === 0) {
        setResults([]);
        setErrorMessage('No results found');
      } else {
        setResults(response.data || [])
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setErrorMessage('Error fetching results');
      setResults([]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleSearch(value);
  };

  return (
    <div className="dashboard">
      <div className="message-content">
        <div className="message-navbar">
          <div className="message-navbar-title">
            <h1>Messages</h1>
          </div>
          <div className="refresh-switch">
            <div className="message-navbar-switch">
              <Switch
                {...register('acceptMessages')}
                checked={acceptMessages}
                onCheckedChange={changeMessageStatus}
                disabled={switching}
                className='accept-switch'
              />
              <span className="ml-2">
                Accept Messages: {acceptMessages ? 'On' : 'Off'}
              </span>
            </div>
            <Button
              className='refresh-button'
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCcw className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <Separator className='message-separator' />

        <div className="message-cards">
          {messages.map((message, index) => (
            <MessageCard key={index} message={message}
              onMessageDelete={handleDeleteMessage}
              onClick={() => {
                setSelectedMessageContent(message.content);
              }}
            />
          ))}
        </div>
      </div>

      <div className="message-section">
        {selectedMessageContent ? (
          <div>
            <p>{selectedMessageContent}</p>
          </div>
        ) : (
          <p>Click on message to see it</p>
        )}
      </div>


     <div className="search-user-section">
        <div className="input-main">
          <Input
            type="text"
            onChange={handleChange}
            placeholder="Search username"
            className='search-input'
          />
        </div>

        <div className="search-user">
          {errorMessage && <p>{errorMessage}</p>}
          {results.map(user => (
            user.username !== session?.user?.username &&
            <div key={user._id} className='search-username-main'
            onClick={() => Router.push(`/sendMessage/${user.username}`)}
            >
              <UserRound className='userround' />
              <div className='search-username'>
                <h1>
                  {user.name}
                </h1>
                <p>
                  {user.username}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
