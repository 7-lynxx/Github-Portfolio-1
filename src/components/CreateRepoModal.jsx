import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Spinner,
//   Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import axios from 'axios';
import PropTypes from 'prop-types';

const CreateRepoModal = ({ isOpen, onClose, addNewRepo, existingRepos }) => {
    const [repoName, setRepoName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateRepo = async () => {
        // Reset error message and set loading state
        setErrorMessage('');
        setIsLoading(true);

        // Check if repoName is empty
        if (!repoName.trim()) {
            setErrorMessage('Repository name cannot be empty.');
            setIsLoading(false);
            return;
        }

        // Check if the description is empty
        if (!description) {
            setErrorMessage("Description cannot be empty.");
            setIsLoading(false);
            return;
        } else {
            setErrorMessage(""); // Clear any previous error message
        }
        // Check if the repo name already exists
        const repoNameExists = existingRepos.some((repo) => repo.name === repoName);
        if (repoNameExists) {
            setErrorMessage('Repository with this name already exists.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                'https://api.github.com/user/repos',
                {
                    name: repoName,
                    description: description,
                },
                {
                    headers: {
                        Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
                    },
                }
            );

            // New repository data from response
            const newRepo = response.data;

            // Mark the new repository as new
            newRepo.isNew = true;

            // Update the list of repositories in the Home component
            addNewRepo(newRepo);

            // Close the modal after successful creation and reset the form fields
            onClose();
            setRepoName('');
            setDescription('');
        } catch (error) {
            // If the repository creation fails, set the error message and disable loading state
            setErrorMessage('Error creating repository: ' + (error.response ? error.response.data.message : 'Unknown error'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create New Repository</ModalHeader>
                <ModalBody>
                    {errorMessage && (
                        <Alert status="error" mb={2}>
                            <AlertIcon />
                            {errorMessage}
                        </Alert>
                    )}
                    <Input
                        placeholder="Repository Name"
                        value={repoName}
                        onChange={(e) => setRepoName(e.target.value)}
                        mb={4}
                    />
                    <Input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="blue"
                        onClick={handleCreateRepo}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner size="sm" mr={2} /> Creating...
                            </>
                        ) : (
                            'Create'
                        )}
                    </Button>
                    <Button ml={3} onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

CreateRepoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    addNewRepo: PropTypes.func.isRequired,
    existingRepos: PropTypes.array.isRequired
};

export default CreateRepoModal;