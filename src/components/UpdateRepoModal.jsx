import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Text } from '@chakra-ui/react';
import axios from 'axios';
import PropTypes from 'prop-types';

const UpdateRepoModal = ({ isOpen, onClose, repo, refreshRepo }) => {
    const [description, setDescription] = useState(repo.description);
    const [isLoading, setIsLoading] = useState(false);

    const handleUpdateRepo = async () => {
        setIsLoading(true);
        try {
            await axios.patch(`https://api.github.com/repos/7-lynxx/${repo.name}`, {
                description,
            }, {
                headers: {
                    Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
                },
            });

            // Refresh repository details after successful update
            refreshRepo();

            // Close the modal
            onClose();
        } catch (error) {
            console.error('Error updating repository:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Repository</ModalHeader>
                <ModalBody>
                    <Text>Name: {repo.name}</Text>
                    <Input
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        mb={4}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleUpdateRepo} isLoading={isLoading}>
                        Save Changes
                    </Button>
                    <Button ml={3} onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

UpdateRepoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    repo: PropTypes.shape({
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    }).isRequired,
    refreshRepo: PropTypes.func.isRequired, // Ensure that refreshRepo is required
};

export default UpdateRepoModal;