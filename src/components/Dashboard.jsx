import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient';
import { Box, Heading, Input, Button, IconButton, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function Dashboard() {
  const [showSignOut, setShowSignOut] = useState(false);
  const [lobbyCode, setLobbyCode] = useState('');
  const navigate = useNavigate();

  const avatarUrl = localStorage.getItem('avatar_url');
  const nickname = localStorage.getItem('nickname');

  const signOutUser = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const joinLobby = async () => {
    if (!lobbyCode) return;

    const { data, error } = await supabase.from('lobbies').select().eq('code', lobbyCode).single();
    if (error) {
      console.error('Error joining lobby:', error.message);
    } else if (data) {
      navigate(`/lobby/${lobbyCode}`);
    } else {
      console.log('Lobby not found');
    }
  };

  return (
    <div className="bg" style={{ height: '100vh' }}>
      <Box
          bg="#2D2D2D"
          color="white"
          padding="4"
          display="flex"
          justifyContent="center" // Center the content horizontally
          alignItems="center"
          position="relative" // Positioning context for the user icon
          height="100px" // Adjust height as needed
        >
        {/* Centered text */}
        <Box
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
        >
          <Heading as="h1" size="2xl" textAlign="center" sx={{ fontSize: '85px', color: '#FC7B1E' }}>
            LIGDINGO
          </Heading>
        </Box>

        {/* User icon and menu */}
        <Box
          position="absolute"
          right="20px"
          top="50%"
          transform="translateY(-50%)"
        >
          <Box
            as="img"
            src={avatarUrl}
            alt={nickname}
            borderRadius="30px"
            boxSize="50px"
            objectFit="cover"
            cursor="pointer"
            onClick={() => setShowSignOut(!showSignOut)}
          />
          {showSignOut && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<ChevronDownIcon />}
                variant="outline"
                ml={2}
                border="none"
                backgroundColor="#FC7B1E"
                color="white"
              />
              <MenuList>
                <MenuItem
                  onClick={signOutUser}
                  bg="#FC7B1E"
                  color="white"
                  _hover={{ bg: "#e76f51" }}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Box>
      </Box>
      <Box padding="4" textAlign="center">
        <Heading as="h2" size="lg" color="gray.700">
          Κωδικός Λιγδobby
        </Heading>
        <Input
          value={lobbyCode}
          onChange={(e) => setLobbyCode(e.target.value)}
          placeholder="Enter lobby code"
          height={'30px'}
          marginRight={'10px'}
          marginTop="4"
        />
        <Button
          onClick={joinLobby}
          width={'8%'}
          height={'40px'}
          fontSize={'20px'}
          sx={{ marginBottom: '7px', roundedBottom: '10px', roundedTop: '10px', backgroundColor: '#FC7B1E', color: 'white', boxShadow: '1px 1px 1px 1px #2D2D2D' }}
          cursor={'pointer'}
          marginTop="4"
          _hover={{ bg: "#db6a18" }}
        >
          Join
        </Button>
      </Box>
    </div>
  );
}

export default Dashboard;
