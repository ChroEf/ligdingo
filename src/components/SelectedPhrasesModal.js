import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Checkbox,
  Grid,
  VStack,
  ModalHeader,
  Button
} from '@chakra-ui/react';

const SelectedPhrasesModal = ({ isOpen, onClose, initialSelectedPhrases }) => {
  const [selectedPhrases, setSelectedPhrases] = useState(initialSelectedPhrases || []);

  const handleCheckboxChange = (phrase) => {
    setSelectedPhrases((prevSelected) => {
      if (prevSelected.includes(phrase)) {
        return prevSelected.filter((p) => p !== phrase); // Remove if already selected
      } else {
        if (prevSelected.length < 5) {
          return [...prevSelected, phrase]; // Add if not already selected
        }
      }
      return prevSelected;
    });
  };

  const handleClose = () => {
    onClose(selectedPhrases, true); // Pass the selected phrases when closing
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
        maxW="300px"      // Set max width of modal
        boxShadow="lg"
        border="3px solid #FC7B1E" // Border color and width
        margin="auto"     // Center horizontally
        marginTop={"10%"}
      >
        <ModalHeader textAlign="center" fontSize="25px" color="black" fontWeight="bold" marginTop="20">
          Selected Phrases
        </ModalHeader>
        <ModalBody>
          <VStack spacing="4" align="center" marginTop="25" marginBottom="20">
            <Grid templateColumns="repeat(1, 1fr)" gap={20}>
              {(initialSelectedPhrases || []).map((phrase, index) => (
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
            <Button
              align="start"
              color={selectedPhrases.length === 5 ? "black" : "gray.600"}
              bg={selectedPhrases.length === 5 ? "#FC7B1E" : "gray.400"}
              onClick={handleClose}
              isDisabled={selectedPhrases.length !== 5}
              marginTop="20%"
              fontSize={"20px"}
              fontWeight="bold"
              width="150px"
              height="50px"
              cursor={selectedPhrases.length === 5 ? "pointer" : "not-allowed"}
              roundedTop="10px"
              roundedBottom="10px"
              textAlign="center"
              _hover={{
                bg: selectedPhrases.length === 5 ? "#FC7B1E" : "gray.400", // Maintain color on hover when disabled
              }}
            >
              LIGDINGO
            </Button>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SelectedPhrasesModal;
