import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Checkbox,
  Grid,
  VStack,
  ModalHeader,
  Text,
  Button,
  ModalFooter
} from '@chakra-ui/react';

const PhrasesModal = ({ isOpen, onClose, phrases, onSelected }) => {
  const [selectedPhrases, setSelectedPhrases] = useState([]);
  const [countdown, setCountdown] = useState(60); // Initial timer set to 10 seconds

  const handleCheckboxChange = (phrase) => {
    setSelectedPhrases((prevSelected) => {
      if (prevSelected.includes(phrase)) {
        return prevSelected.filter((p) => p !== phrase);
      } else {
        if (prevSelected.length < 5) {
          return [...prevSelected, phrase];
        } else {
          return prevSelected;
        }
      }
    });
  };

  useEffect(() => {
    if (isOpen) {
      // Set a countdown timer
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000); // Decrease countdown every 1 second

      // Close the modal when countdown reaches 0
      if (countdown === 0) {
        onClose();
      }

      // Clean up the timer if the modal closes or component unmounts
      return () => clearInterval(timer);
    }
  }, [isOpen, countdown, onClose]);

  const handleClose = () => {
    onSelected(selectedPhrases);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
      <ModalOverlay 
        bg="rgba(0, 0, 0, 0.3)" // Slightly darken the background
        backdropFilter="blur(8px)" // Blur effect
      />
      <ModalContent
        bg="white"
        borderRadius="10px"   // Rounded corners
        padding="4"
        maxW="1000px"      // Set max width of modal
        boxShadow="lg"
        border="3px solid #FC7B1E" // Border color and width
        margin="auto"
        marginTop="10%"  
            // Centering within the available space
      >
        <Text fontSize="20px" color="black" fontWeight="bold" marginTop="4" textAlign="center">
            Closing in {countdown} seconds...
          </Text>
        <ModalHeader textAlign="center" fontSize="25px" color="black" fontWeight="bold" marginTop="4"> Διάλεξε 5: </ModalHeader> 
        <ModalBody align="start">
          <VStack align="start" marginTop="25" marginBottom="20" marginLeft="20">
            <Grid templateColumns="repeat(4, 1fr)" gap={20}>
              {phrases.map((phrase, index) => (
                <Checkbox
                  key={index}
                  colorScheme="orange"
                  isChecked={selectedPhrases.includes(phrase)}
                  onChange={() => handleCheckboxChange(phrase)}
                >
                  {phrase}
                </Checkbox>
              ))}
            </Grid>
          </VStack>
          </ModalBody>
          <ModalFooter margin={"auto"}>
          <Button
            align="start"
            color={selectedPhrases.length === 5 ? "black" : "gray.600"}
            bg={selectedPhrases.length === 5 ? "#FC7B1E" : "gray.400"}
            onClick={handleClose}
            isDisabled={selectedPhrases.length !== 5}
            marginTop="4"
            marginBottom="10"
            width="175px"
            height="50px"
            cursor={selectedPhrases.length === 5 ? "pointer" : "not-allowed"}
            roundedTop="10px"
            roundedBottom="10px"
            textAlign="center"
            _hover={{
              bg: selectedPhrases.length === 5 ? "#FC7B1E" : "gray.400", // Maintain color on hover when disabled
            }}
          >
              Confirm 
            </Button>
          </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PhrasesModal;
