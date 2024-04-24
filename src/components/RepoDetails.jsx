import React, { useEffect, useState, useCallback } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import UpdateRepoModal from "./UpdateRepoModal";
import DeleteRepoModal from "./DeleteRepoModal";

const RepoDetails = () => {
    const { repoName } = useParams();
    const location = useLocation();
    const navigate = useNavigate(); // Hook should be at the top level

    const { repo: locationRepo, isNew } = location.state || {};

    const [repo, setRepo] = useState(locationRepo || null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const gitHubToken = import.meta.env.VITE_GITHUB_TOKEN;

    // Function to fetch repository details
    const fetchRepo = useCallback(async () => {
        try {
            const response = await axios.get(`https://api.github.com/repos/7-lynxx/${repoName}`, {
                headers: {
                    Authorization: `token ${gitHubToken}`,
                },
            });
            setRepo(response.data);
        } catch (error) {
            console.error("Error fetching repository details:", error);
        }
    }, [repoName, gitHubToken]);

    const refreshRepo = async () => {
        try {
            const response = await axios.get(`https://api.github.com/repos/7-lynxx/${repoName}`, {
                headers: {
                    Authorization: `token ${gitHubToken}`,
                },
            });
            setRepo(response.data);
        } catch (error) {
            console.error("Error refreshing repository details:", error);
        }
    };

    // Fetch repository details on component mount
    useEffect(() => {
        if (!repo) {
            fetchRepo();
        }
    }, [fetchRepo, repo]);

    // Handlers for modal operations
    const openUpdateModal = () => setIsUpdateModalOpen(true);
    const closeUpdateModal = () => setIsUpdateModalOpen(false);

    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    // Handler to go back to the previous page
    const handleGoBack = () => {
        navigate(-1);
    };

    if (!repo) {
        return <Box>Loading...</Box>;
    }
    console.log(repo);

    return (
        <Box p={15} color='purple' textAlign='center'
        height='95vh'
        display='flex'
        flexDirection='column'
        bg='gray.500'
        justifyContent='space-between'
        >
            <Text fontSize="2xl" fontWeight='black'>
                {repo.name}
                </Text>
            <Text>Description: {repo.description}</Text>
            <Text>Stars: {repo.stargazers_count}</Text>
            <Text>Forks: {repo.forks_count}</Text>
            <Text>
                Owner: 

                {repo.owner?repo.owner.login : "Unknown"} 
                </Text>
            <Text>Language: {repo.language || 'N/A'} </Text>
            <Text>Creation date: {new Date(repo.created_at).toLocaleDateString()} </Text>
            <Text>Last Updated: {new Date(repo.pushed_at).toLocaleDateString()} </Text>
            <Text>Link to repository on github: {" "} 
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer"> {repo.html_url}</a>
            </Text>
            <Text>Issues: {repo.open_issues} </Text>

               {/* Go back button */}
               <Flex mt={2} justifyContent='center'><Button size="md" width='50%' colorScheme="blue" mt={4} onClick={handleGoBack}>
                Go Back
            </Button>
            </Flex> 


            {/* Conditionally render the update and delete buttons for newly created repos */}
            {isNew && (
                <Flex mt={2} justifyContent='center'>
                    <Button mt={4} mr={5} size="md" width='30%'  onClick={openUpdateModal}
                    colorScheme="teal"
                    variant='outline'>
                        Update Repository
                    </Button>
                    <Button mt={4} size="md" width='30%'   colorScheme="red" onClick={openDeleteModal}>
                        Delete Repository
                    </Button>
               </Flex>
            )}

            {/* Modals */}
            <UpdateRepoModal
                isOpen={isUpdateModalOpen}
                onClose={closeUpdateModal}
                repo={repo}
                refreshRepo={refreshRepo}
            />
            <DeleteRepoModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                repo={repo}
                refreshRepo={refreshRepo}
            />

         
        </Box>
    );
};

export default RepoDetails;