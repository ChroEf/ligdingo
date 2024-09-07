import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import supabase from '../supabaseClient'; // Adjust import if necessary
import { Box, Heading, IconButton, Menu, MenuButton, MenuList, MenuItem, VStack, Text, Button } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import PhrasesModal from './PhrasesModal';
import SelectedPhrasesModal from './SelectedPhrasesModal';

// Sample phrases array
const phrases = [
  "ΤΙΟΥΜΠΑ",
  "Αναλόγως και Τοιουτοτρόπως",
  "Μμμ Μμμ Μμμ Μμμ",
  "Ματώνει το πετσάκι",
  "Γαστρονομικά μονοπάτια, που λίγοι έχουν βαδίσει",
  "Εμένα τραβάω",
  "Νίκος Βενέτης",
  "Για πολλά δάκρυα χαράς",
  "Απόδειξη",
  "Τους αλλάζω τα πετρέλαια",
  "Να ξεπλύνουμε παλέτα",
  "Ρομάλεν Τσαβάλεν",
  "Χοντρέματα",
  "Τον ήπιαμε μπρούσκο",
  "Challenge",
  "Αυτό είναι το κανάλι μου",
  "Κατηγορία Champions League",
  "Εδέσματα",
  "Μερακλίδικο",
  "Cheers",
  "Ας απολαύσουμε",
  "Γυράδικο Κώστας",
  "Copyright μουσική",
  "Πάμε να εμβαθύνουμε",
  "Ενυδατική ουσία",
  "Γαλαντόμo/α",
  "Βάζει χέρι στο φαί",
  "Προσωπικότητα και Χαρακτήρα",
  "Ανδρέας Δέσσος",
  "Τάταρος Χιμπαντζής Βατραχομούρης",
  "Επιλήψιμο",
  "Ξεδίπλωμα",
  "Σιδηρούν Παραπέτασμα",
  "Τα καθέκαστα",
  "Φούστα Μπλούζα",
  "Μύγες",
  "Teosty, απ΄το Τεο και tasty",
  "Οπαδοί γνωστής Ιταλικής ομάδας",
];

function LobbyView() {
  const { code } = useParams();
  const [userNicknames, setUserNicknames] = useState([]);
  const [showSignOut, setShowSignOut] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [isPhrasesModalOpen, setIsPhrasesModalOpen] = useState(false); // State to control first modal visibility
  const [isSelectedPhrasesModalOpen, setIsSelectedPhrasesModalOpen] = useState(false); // State for second modal
  const [selectedPhrases, setSelectedPhrases] = useState([]); // Store selected phrases
  const [showLobbyInfo, setShowLobbyInfo] = useState(true); // Define showLobbyInfo state
  const [gameEnded, setGameEnded] = useState(false);
  const [winnerNickname, setWinnerNickname] = useState('');
  const [userPhrases, setUserPhrases] = useState({});
  const [showWinnerOverlay, setShowWinnerOverlay] = useState(false);
  const navigate = useNavigate();

  const avatarUrl = localStorage.getItem('avatar_url');
  const nickname = localStorage.getItem('nickname');

  const signOutUser = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    console.log('LobbyView useEffect running');
    const storedLobbyData = JSON.parse(localStorage.getItem('lobby_data'));
    
    const fetchLobby = async () => {
      console.log('Fetching lobby data');
      const { data, error } = await supabase
        .from('lobbies')
        .select('*')
        .eq('code', code)
        .single();
  
      if (error) {
        console.error('Error fetching lobby:', error.message);
        if (error.message.includes('not found')) {
          navigate('/');
        }
      } else if (data) {
        console.log('Lobby data:', data);
        localStorage.setItem('lobby_data', JSON.stringify(data));
  
        // Rehydrate state
        const users = JSON.parse(localStorage.getItem('lobby_users') || '[]');
        const currentUser = { nickname: localStorage.getItem('nickname') };
        if (!users.some(user => user.nickname === currentUser.nickname)) {
          users.push(currentUser);
        }
        
        setUserNicknames(users.map(user => user.nickname));
        localStorage.setItem('lobby_users', JSON.stringify(users));
  
        setUserPhrases(users.reduce((acc, user) => {
          acc[user.nickname] = JSON.parse(localStorage.getItem(`${user.nickname}_phrases`) || '[]');
          return acc;
        }, {}));
  
        if (['poul_maniac', 'Sp1nach_Pie'].includes(currentUser.nickname)) {
          setCanStart(true);
        } else {
          setCanStart(false);
        }
      } else {
        console.log('Lobby not found');
        navigate('/');
      }
    };
  
    const handleRealTimeUpdate = (payload) => {
      console.log('Real-time update:', payload);
      fetchLobby();
    };
  
    const subscription = supabase
      .channel('public:lobbies')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'lobbies', filter: `code=eq.${code}` }, handleRealTimeUpdate)
      .subscribe();
  
    if (code) {
      fetchLobby();
    }
  
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Visibility changed to visible');
        const storedLobbyData = JSON.parse(localStorage.getItem('lobby_data'));
  
        if (storedLobbyData && storedLobbyData.users) {
          console.log('Retrieved lobby data from localStorage:', storedLobbyData);
          setUserNicknames(storedLobbyData.users.map(user => user.nickname));
          setUserPhrases(storedLobbyData.users.reduce((acc, user) => {
            acc[user.nickname] = JSON.parse(localStorage.getItem(`${user.nickname}_phrases`) || '[]');
            return acc;
          }, {}));
          
          if (['poul_maniac', 'Sp1nach_Pie'].includes(nickname)) {
            setCanStart(true);
          } else {
            setCanStart(false);
          }
  
        } else {
          fetchLobby(); // Fetch from server if local data isn't correct
        }
      }
    };
  
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const handleBeforeUnload = (event) => {
        if (!gameEnded) {
            event.preventDefault();
            event.returnValue = ''; // For older browsers
        }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
  
    return () => {
      subscription.unsubscribe();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [code, navigate, gameEnded]);

  const openPhrasesModal = () => {
    setIsPhrasesModalOpen(true);
    setShowLobbyInfo(false); // Hide lobby info when modal opens
  };

  const closePhrasesModal = () => setIsPhrasesModalOpen(false);
  const openSelectedPhrasesModal = () => setIsSelectedPhrasesModalOpen(true);
  const closeSelectedPhrasesModal = () => setIsSelectedPhrasesModalOpen(false);

  const handlePhrasesModalClose = (selected) => {
    setSelectedPhrases(selected);
    if (selected.length === 5) {
      // Save user phrases in local storage
      localStorage.setItem(`${nickname}_phrases`, JSON.stringify(selected));
      openSelectedPhrasesModal();
    }
  };

  const handleSelectedPhrasesModalClose = (selectedPhrases, endGame = false) => {
    if (endGame) {
      // End the game
      setGameEnded(true);
      setWinnerNickname(nickname);
  
      // Close other modals
      setIsSelectedPhrasesModalOpen(false);
      setIsPhrasesModalOpen(false);
      
      // Optionally update local storage or backend to indicate game has ended
      localStorage.setItem('game_winner', nickname);
    } else {
      setSelectedPhrases(selectedPhrases);
    }
    closeSelectedPhrasesModal();
  };

  return (
    <div className="bg" style={{ height: '100vh', position: 'relative' }}>
      {/* Lobby View */}
      <Box
        style={{ position: 'relative', zIndex: gameEnded ? 1 : 'auto' }}
      >
        <Box
          bg="#2D2D2D"
          color="white"
          padding="4"
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
          height="100px"
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
  
        <Box padding="4" display="flex" flexDirection="column" alignItems="center">
          {!isPhrasesModalOpen && showLobbyInfo && (
            <>
              <Heading as="h2" size="lg" color="gray.700" textAlign="center">
                Lobby Code: {code}
              </Heading>
              {canStart && (
                <Button 
                  marginTop="4" 
                  width={'10%'}
                  height={'70px'}
                  fontSize={'25px'}
                  sx={{ roundedBottom: '10px', roundedTop: '10px', backgroundColor: '#FC7B1E', color: 'white', boxShadow: '1px 1px 1px 1px #2D2D2D' }}
                  cursor={'pointer'}
                  _hover={{ bg: "#db6a18" }}
                  onClick={openPhrasesModal}
                >
                  Start
                </Button>
              )}
            </>
          )}
        </Box>
  
        {!isPhrasesModalOpen && showLobbyInfo && (
          <Box
            padding="4"
            display="flex"
            justifyContent="flex-end"
            position="absolute"
            top="100px"
            left="20px"
          >
            <VStack align="flex-end" spacing={4}>
              <Text color="#FC7B1E" fontSize="20px" marginTop="20" fontWeight={'bold'}>
                {userNicknames.length} {userNicknames.length === 1 ? 'User' : 'Users'} in Lobby
              </Text>
              {userNicknames.length > 0 ? (
                userNicknames.map((nickname, index) => (
                  <Text key={index} color="black" marginTop="-10px" textAlign="right" fontWeight={'bold'} fontSize="15px">
                    {nickname}
                  </Text>
                ))
              ) : (
                <Text color="black" textAlign="right">No users have joined yet.</Text>
              )}
            </VStack>
          </Box>
        )}
  
        <PhrasesModal 
          isOpen={isPhrasesModalOpen} 
          onClose={closePhrasesModal} 
          phrases={phrases} 
          onSelected={handlePhrasesModalClose} 
        />
        <SelectedPhrasesModal 
          isOpen={isSelectedPhrasesModalOpen} 
          onClose={(selectedPhrases, endGame) => handleSelectedPhrasesModalClose(selectedPhrases, endGame)} 
          initialSelectedPhrases={selectedPhrases} 
        />
      </Box>
  
      {/* Winner Overlay */}
      {gameEnded && (
        <Box
          position="absolute"
          top="0"
          left="0"
          width="100%"
          height="100%"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          bg="rgba(0, 0, 0, 0.7)"
          zIndex="999"
        >
          <Heading fontSize={'100px'} marginTop={'-5%'} color="#FC7B1E" mb="4">
            Winner
          </Heading>
          <Text
            fontSize="50px"
            fontWeight="bold"
            sx={{
              background: 'linear-gradient(to bottom right, #00f5d4 10%, #f50077 85%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline' // Ensures the gradient applies to inline text
            }}
          >
            {winnerNickname}
          </Text>
          <Button 
            onClick={() => {
              setGameEnded(false);
              if (nickname === 'poul_maniac' || nickname === 'Sp1nach_Pie') {
                navigate('/streamer-view'); // Navigate to StreamerView
              } else {
                navigate('/dashboard'); // Navigate to Dashboard
              }
            }}
            color="black"
            backgroundColor="white"
            size="lg"
            mt="4"
            cursor={'pointer'}
            width="100px"
            height="30px"
            fontSize={'18px'}
            borderRadius={"10px"}
          >
            Close
          </Button>
        </Box>
      )}
    </div>
  );
  
}

export default LobbyView;
