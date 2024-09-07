import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Button, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import supabase from '../supabaseClient';

function StreamerView() {
  const [showSignOut, setShowSignOut] = useState(false);
  const navigate = useNavigate();

  const avatarUrl = localStorage.getItem('avatar_url');
  const nickname = localStorage.getItem('nickname');

  const signOutUser = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const createLobby = async () => {
    console.log('createLobby called');
    const code = Math.random().toString(36).substring(2, 8).toUpperCase(); // Generate a random code
  
    // Save the code to Supabase
    const { error } = await supabase.from('lobbies').insert([{ code }]);
    if (error) {
      console.error('Error creating lobby:', error.message);
    } else {
      navigate(`/lobby/${code}`);
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
        <Button
          width={'15%'}
          height={'70px'}
          fontSize={'25px'}
          marginTop={'100px'}
          sx={{ roundedBottom: '10px', roundedTop: '10px', backgroundColor: '#FC7B1E', color: 'white', boxShadow: '1px 1px 1px 1px #2D2D2D' }}
          cursor={'pointer'}
          onClick={createLobby}
          _hover={{ bg: "#db6a18" }}
        >
          Φτιάξε Λιγδobby
        </Button>
      </Box>
    </div>
  );
}

export default StreamerView;
