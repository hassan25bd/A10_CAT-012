'use client';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

export default function GoogleLoginButton({ role = 'user', label = 'Continue with Google' }) {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const btnRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => initGoogle();
      document.head.appendChild(script);
    } else {
      initGoogle();
    }
    initialized.current = true;
  }, []);

  const initGoogle = () => {
    if (!window.google || !btnRef.current) return;
    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '219316083151-fo7f8devpdst1vhobhflmljqfk5fo5r1.apps.googleusercontent.com',
      callback: handleCredential,
    });
    window.google.accounts.id.renderButton(btnRef.current, {
      theme: 'filled_black',
      size: 'large',
      width: btnRef.current.offsetWidth || 360,
      text: 'continue_with',
      shape: 'rectangular',
    });
  };

  const handleCredential = async (response) => {
    try {
      // Decode JWT from Google to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      const user = await googleLogin(
        { name: payload.name, email: payload.email, googleId: payload.sub, avatar: payload.picture },
        role
      );
      toast.success(`Welcome, ${user.name}!`);
      if (user.role === 'admin') router.push('/dashboard/admin');
      else if (user.role === 'writer') router.push('/dashboard/writer');
      else router.push('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google login failed');
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div ref={btnRef} className="w-full" />
    </div>
  );
}
