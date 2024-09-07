// src/components/Callback.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';

const Callback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Callback component mounted');
    const params = new URLSearchParams(window.location.search);
    const hash = window.location.hash;
    const accessToken = new URLSearchParams(hash.substring(1)).get('access_token');
    const code = params.get('code');
    const error = params.get('error');

    console.log('Window location search:', window.location.search);
    console.log('Window location hash:', window.location.hash);
    console.log('Access token:', accessToken);
    console.log('Authorization code:', code);
    console.log('Error:', error);

    if (error) {
      console.error('Error during login:', error);
      // Handle error (e.g., display error message)
      return;
    }

    if (accessToken) {
      console.log('Access Token found:', accessToken);
      authenticateWithSupabase(accessToken);
    } else if (code) {
      console.log('Authorization code found:', code);
      exchangeCodeForAccessToken(code);
    } else {
      console.log('No access token or authorization code found');
    }
  }, []);

  const exchangeCodeForAccessToken = async (code) => {
    try {
      console.log('Exchanging code for access token...');
      const response = await fetch('https://id.twitch.tv/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: process.env.REACT_APP_TWITCH_CLIENT_ID,
          client_secret: process.env.REACT_APP_TWITCH_CLIENT_SECRET,
          code: code,
          grant_type: 'authorization_code',
          redirect_uri: process.env.REACT_APP_TWITCH_REDIRECT_URI
        })
      });

      const data = await response.json();
      console.log('Response from token exchange:', data);

      if (data.access_token) {
        console.log('Access Token received:', data.access_token);
        authenticateWithSupabase(data.access_token);
      } else {
        console.error('Failed to receive access token:', data);
      }
    } catch (error) {
      console.error('Error exchanging code for access token:', error);
    }
  };

  const authenticateWithSupabase = async (token) => {
    try {
      console.log('Authenticating with Supabase...');
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'twitch',
        token: token
      });

      if (error) {
        console.error('Error authenticating with Supabase:', error.message);
        return;
      }

      console.log('Authenticated with Supabase:', data);

      setLoading(false);
      navigate('/dashboard'); // Redirect to the dashboard component
    } catch (error) {
      console.error('Error authenticating with Supabase:', error);
    }
  };

  return <div>{loading ? 'Loading...' : 'Redirecting...'}</div>;
};

export default Callback;
