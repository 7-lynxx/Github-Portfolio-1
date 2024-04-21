import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import PropTypes from 'prop-types';

const DeleteRepoModal = ({ isOpen, onClose, repo, refreshRepo }) => {
    const gitHubToken = import.meta.env.VITE_GITHUB_TOKEN;
    const [isDeleting, setIsDeleting] = useState(false);
    const toast = useToast();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            // Make the API call to delete the repository
            await axios.delete(`https://api.github.com/repos/7-lynxx/${repo.name}`, {
                headers: {
                    Authorization: `token ${gitHubToken}`,
                },
            });

            // Refresh the repo data after deletion
            refreshRepo();

            // Notify the user of successful deletion
            toast({
                title: 'Repository deleted successfully.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });

            // Close the modal
            onClose();
        } catch (error) {
            console.error("Error deleting repository:", error);

            // Handle 403 error by notifying the user they lack permission to delete the repository
            if (error.response && error.response.status === 403) {
                toast({
                    title: 'Permission denied.',
                    description: 'You do not have the necessary permissions to delete this repository.',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                toast({
                    title: 'Error deleting repository.',
                    description: error.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } finally {
            onClose();
            setIsDeleting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent >
                <ModalHeader>Delete Repository</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text>Are you sure you want to delete the repository {repo.name}?</Text>
                </ModalBody>
                <ModalFooter>
                    <Button
                        colorScheme="red"
                        onClick={handleDelete}
                        mr={3}
                        isLoading={isDeleting}
                    >
                        Delete
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

// Define prop types for the DeleteRepoModal component
DeleteRepoModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    repo: PropTypes.shape({
        name: PropTypes.string.isRequired,
    }).isRequired,
    refreshRepo: PropTypes.func.isRequired,
};

export default DeleteRepoModal;