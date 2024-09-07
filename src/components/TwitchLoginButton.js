import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { Container, Box, Heading, Text } from '@chakra-ui/react';
import '../styles/styles.css';
import StreamerView from './StreamerView';  // Import the StreamerView component

function TwitchLoginButton() {
  const navigate = useNavigate();

  useEffect(() => {
    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Extract user data
        const user = session?.user;
        if (user) {
          const { user_metadata } = user;
          const { avatar_url, nickname } = user_metadata || {};

          // Log the user data
          console.log('User metadata:', user_metadata);
          console.log('Avatar URL:', avatar_url);
          console.log('Nickname:', nickname);

          // Store in localStorage
          if (avatar_url && nickname) {
            localStorage.setItem('avatar_url', avatar_url);
            localStorage.setItem('nickname', nickname);
          } else {
            console.error('Avatar URL or nickname is missing.');
          }

          // Navigate based on nickname
          if (nickname === 'poul_maniac' || nickname === 'Sp1nach_Pie') {
            navigate('/streamer-view'); // Navigate to the StreamerView
          } else {
            navigate('/dashboard'); // Navigate to the Dashboard
          }
        } else {
          console.error('No user data found.');
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/');
      }
    });

    return () => {
      if (subscription) subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="bg">
      <Container centerContent height={'100vh'}>
        <Box 
          padding="4" 
          bg="gray.100" 
          maxW="3xl" 
          borderRadius="md" 
          boxShadow="md"
          mt={8}
        >
          <Heading as="h1" size="2xl" textAlign="center" sx={{ fontSize: '85px', marginTop: '70%', color:'#FC7B1E' }}> 
            LIGDINGO
          </Heading>
          <Text fontSize='sm' textAlign='center' sx={{ fontSize: '18px', marginTop: '35px', color: 'black' }}>
            Συμπλήρωσε τα καθέκαστα
            <br />↓
          </Text>
          <div style={{ 
            color: 'black',
            fontSize: '18px',
            marginTop: '-20px',
            paddingLeft: '90px',
            paddingRight: '90px',
            }}>
            <Auth 
              supabaseClient={supabase}
              providers={["twitch"]}
              onlyThirdPartyProviders={true}
            />
          </div>
        </Box>
      </Container>
    </div>
  );
}

export default TwitchLoginButton;
