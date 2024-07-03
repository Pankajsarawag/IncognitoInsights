'use client';
import { useState } from 'react';
import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import './navbar.css';

import {
  LogOut,
  LogIn,
  UserRoundX,
  Mail,
  UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

import { Loader2 } from 'lucide-react';

function Navbar() {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<User[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [alertOpen, setAlertOpen] = useState(false);

  const handleLoginClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 100);
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.replace('/');
  };

  const deleteAccount = async () => {
    router.replace('/deleteAccount');
  }

  const handleSearch = async (searchTerm: string) => {
    if (searchTerm === '') {
      setResults([]);
      setErrorMessage('');
      return;
    }

    try {
      const response = await axios.post('/api/searchUsername', {
        keyword: searchTerm,
      });

      if (response.data.length === 0) {
        setResults([]);
        setErrorMessage('No results found');
      } else {
        setResults(response.data || []);
        setErrorMessage('');
      }
      setAlertOpen(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setErrorMessage('Error fetching results');
      setResults([]);
      setAlertOpen(true);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    handleSearch(value);
  };

  return (
    <nav className="navbar">
      <div className="navbar_logo">
        <img src="/logo.png" alt="Logo" />
      </div>
      {session ? (
        <div className="avatar">
          <div className="searchbar">
            <Input
              type="text"
              onChange={handleChange}
              placeholder="Search username"
              className="search-input"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="Avatar">
                <AvatarImage src="/favicon.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="drop-down-menu-content">
              <DropdownMenuLabel style={{ color: 'white' }}>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator style={{ backgroundColor: 'gray' }} />
              <DropdownMenuItem style={{ color: 'white' }}>
                <UserRound style={{ color: 'white', marginRight: 10 }} />
                {user?.name}
              </DropdownMenuItem>
              <DropdownMenuItem style={{ color: 'white' }}>
                <Mail style={{ color: 'white', marginRight: 10 }} />
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuItem
                style={{ color: 'white', cursor: 'pointer' }}
                onClick={deleteAccount}
              >
                <UserRoundX style={{ color: 'white', marginRight: 10 }} />
                Delete Account
              </DropdownMenuItem>
              <DropdownMenuSeparator style={{ backgroundColor: 'gray' }} />
              <DropdownMenuItem
                onClick={logout}
                style={{ color: 'white', cursor: 'pointer' }}
              >
                <LogOut style={{ color: 'white', marginRight: 10 }} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {results.length > 0 && (
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
              <AlertDialogContent className="alert-dialog-content">
                <AlertDialogHeader className="alert-dialog-header">
                  {errorMessage && <p>{errorMessage}</p>}
                  {results.map((user) => (
                    user.username !== session?.user?.username && (
                      <div key={user._id} className="search-username-container">
                        <div
                          className="search-username-main"
                          onClick={() => router.push(`/sendMessage/${user.username}`)}
                        >
                          <UserRound className="userround" />
                          <div className="search-username">
                            <h1>{user.name}</h1>
                            <p>{user.username}</p>
                          </div>
                        </div>
                      </div>
                    )
                  ))}
                </AlertDialogHeader>
                <AlertDialogCancel className='alert-dialog-cancel'>Cancel</AlertDialogCancel>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      ) : (
        <div className="login-button">
          <Link href="/sign-in">
            <Button onClick={handleLoginClick} disabled={loading}>
              {loading ? (
                <Loader2 className="loader" />
              ) : (
                <>
                  <LogIn className="Login-icon" />
                </>
              )}
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
