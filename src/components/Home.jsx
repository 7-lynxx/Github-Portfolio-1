import React, { useState, useEffect, useCallback } from "react";
import { Box, Button, Input, VStack, Spinner, Text, Flex, 
    // Heading, Stack, Center, 
    Image, useBreakpointValue } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CreateRepoModal from "./CreateRepoModal";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Helmet } from "react-helmet-async";

const Home = ( ) => {
    const [repos, setRepos] = useState([]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [noResultsMessage, setNoResultsMessage] = useState(null);

    const navigate = useNavigate();

    const isSmallScreen = useBreakpointValue({
        base: true , md: false
    }); //Chakra UI for rendering based on screen size

    // Access GitHub token from environment variables
    const gitHubToken = import.meta.env.VITE_GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;

    // Number of repositories to fetch per page
    const perPage = 3;

    // Function to fetch repositories
    const fetchRepos = useCallback(
        async () => {
            setLoading(true);
            const baseUrl = search
                ? `https://api.github.com/search/repositories`
                : `https://api.github.com/users/7-lynxx/repos`;

            try {
                const response = await axios.get(baseUrl, {
                    params: search
                        ? {
                            q: `${search} user:7-lynxx`,
                            page,
                            per_page: perPage,
                        }
                        : {
                            page,
                            per_page: perPage,
                        },
                    headers: {
                        Authorization: `token ${gitHubToken}`,
                    },
                });

                const data = search ? response.data.items : response.data;
                setRepos(data);

                // Update no results message based on the fetched data
                if (data.length === 0) {
                    setNoResultsMessage("No repositories found for the search query. Please try another term");
                } else {
                    setNoResultsMessage(null);
                }

                // Check if there is a next page
                const linkHeader = response.headers.link;
                let hasNextPage = false;

                if (linkHeader) {
                    const links = linkHeader.split(',').map(link => link.trim());
                    hasNextPage = links.some(link => link.includes('rel="next"'));
                }

                setHasMore(hasNextPage);
            } catch (error) {
                console.error("Error fetching repositories:", error);
                setHasMore(false);
            } finally {
                setLoading(false);
            }
        },
        [search, page, perPage, gitHubToken]
    );

    useEffect(() => {
        fetchRepos();
    }, [search, page, fetchRepos]);

    const openCreateModal = () => setIsCreateModalOpen(true);
    const closeCreateModal = () => setIsCreateModalOpen(false);

    // Function to add newly created repositories to the list
    const addNewRepo = (newRepo) => {
        setRepos((prevRepos) => [newRepo, ...prevRepos]);
    };

    const handlePageChange = (newPage) => {
        if (!hasMore && newPage > page) {
            setPage(1);
        } else {
            setPage(newPage);
        }
    };

    // const causeError = () => {
    //     throw new Error('Intentional Error');
    // };

    return (
        <Flex
            height="100vh" // Full height of the viewport
            width="100%" // Full width of the viewport
            direction={isSmallScreen ? 'column' : 'row'} // Change direction based on screen size
            p={3}
        >
            <Helmet>
           <title>Github Portfolio</title>
          <meta name="description" content="View reposiories from github"/>
            </Helmet>
            {/* Column A */}
            <Flex
                 className="column-a bg-cover bg-center bg-no-repeat animate-backgroundAnimation"
                 style={{
                     backgroundImage: "url('/assets/bg.jpg')",
                     animation: "backgroundAnimation 10s linear infinite",
                 }}
                flex={1} // Proportional space for Column A
                bg="gray.100" // Light background color
                p={isSmallScreen? 2 : 4}
                direction="column"
                justify={isSmallScreen ? 'space-between' : 'space-between'}
                overflowY={isSmallScreen ? 'auto' : 'visible'} // Allow scrolling on smaller screens
                height={isSmallScreen ?  '50vh' : 'auto'}
                maxH={isSmallScreen ? '50vh' : 'auto'}
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '10px', // Width of the scrollbar
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'gray.500', // Color of the scrollbar thumb
                        borderRadius: 'full', // Round edges for the scrollbar thumb
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'gray.300', // Color of the scrollbar track
                    },
                }}
            >
                {/* Image and headings */}
                <Box>
                    <Flex align="center">
                        <img
                            src="/assets/github_avatarm.jpg"
                            alt="github_avatar"
                            style={{ width: isSmallScreen ? '40px' : '100px',
                            height: isSmallScreen ? '50px' : '100px', borderRadius: '50%' }}
                        />
                        <Box ml={4}>
                            <Text fontSize={isSmallScreen ? 'xl' : '2xl'} 
                            color="white" fontWeight="black">
                                Ayo
                                {/* Demo-Name */}
                            </Text>
                            <Text fontSize={isSmallScreen ? 'lg' : 'xl'} color="white" fontWeight="black">
                                7-lynxx
                                {/* Demo-Username */}
                            </Text>
                        </Box>
                    </Flex>
                    {/* GitHub link */}
    <Flex align="center" mt={2}>
        {/* GitHub icon */}
        <Box mr={2}>
            <a href="https://github.com/7-lynxx" target="_blank" rel="noopener noreferrer">
                <Image src="/assets/github-white-mark.png" alt="GitHub" width="24px" height="24px" />
            </a>
        </Box>
        {/* GitHub link */}
        <Text fontSize={isSmallScreen ? 'md' : 'lg'} color="white">
            <a href="https://github.com/7-lynxx" target="_blank" rel="noopener noreferrer">My GitHub</a>
        </Text>
    </Flex>
</Box>
                

                {/* Description box */}
                <Box
                    bg="grey.500" // Set background color
                    p={isSmallScreen? 2 : 4} // Padding
                    mb={isSmallScreen ? 2: 4} // Margin bottom
                    borderWidth={1} // Border width
                    borderColor="gray.300" // Border color
                    borderRadius="md" // Border radius
                    maxHeight={isSmallScreen ? '10vh' : 'auto'}
                    overflowY={isSmallScreen ? 'auto' : 'visible'} // Allow scrolling on small screens
                    marginY={isSmallScreen ? '2px' : 'auto'}
                    sx={{
                        '&::-webkit-scrollbar': {
                            width: '10px', // Width of the scrollbar
                        },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'gray.500', // Color of the scrollbar thumb
                            borderRadius: 'full', // Round edges for the scrollbar thumb
                        },
                        '&::-webkit-scrollbar-track': {
                            backgroundColor: 'gray.300', // Color of the scrollbar track
                        },
                    }}
                >
                    <Text fontSize="lg" as="strong" color='white' >
                        <Text as="strong">Note: </Text> 
                        Due to the permissions set for the GitHub token being used, you won`t be able to update or delete already created repositories. Whenever you create a new repository, you only have access to update it immediately. You won`t be allowed to delete the repository.`
                    </Text>
                </Box>

                {/* Error boundary and 404 page buttons */}
                <Box mt={isSmallScreen ? 2 : 5}>
                    <Flex justify="space-between">
                        <Button colorScheme="red" onClick={() => {throw new Error('Intentional Error')}}>
                            Test Error Page
                        </Button>
                        <Button backgroundColor="black"
                        color='white' onClick={() => navigate('/non-existent-url')}>
                            Test 404 Page
                        </Button>
                    </Flex>
                </Box>
            </Flex>
            {/* Column B */}
            <Flex
                flex={2} // Proportional space for Column B
                bg="gray.600" // Dark background color
                color="white"
                p={isSmallScreen ? 2 : 4}
                direction="column" // Column layout
                overflowY='auto'
                height={isSmallScreen ? '50vh' : 'auto'}
                maxH={isSmallScreen ? '50vh' : 'auto'}
                sx={{
                    '&::-webkit-scrollbar': {
                        width: '10px', // Width of the scrollbar
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: 'gray.500', // Color of the scrollbar thumb
                        borderRadius: 'full', // Round edges for the scrollbar thumb
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: 'gray.300', // Color of the scrollbar track
                    },
                }}
             // Add vertical scrolling if needed
            >
                {/* Search input */}
                <Box mb={4}>
                    <Input
                        placeholder="Search repositories"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1); // Reset to the first page on search change
                        }}
                    />
                </Box>

                {/* Display loading spinner */}
                {loading && (
                    <Box display="flex" justifyContent="center" mt={4}>
                        <Spinner size="xl" color="white" />
                    </Box>
                )}

                {/* Display no results message if applicable */}
                {noResultsMessage && (
                    <Flex direction="column" align="center" mt={4} color="white.700">
                        <Text>
                        {noResultsMessage}
                        </Text>
                    <Image src='./src/assets/notfound.png'
                    alt='Not Found'
                    boxSize='150px'
                    objectFit="cover"/>
                    </Flex>
                )}

               {/* Repository list */}
               <VStack spacing={4} flex={1}>
    {repos.map((repo) => (
        <Box
            key={repo.id}
            p={isSmallScreen? 2 : 4} // Padding to make the boxes bigger
            bg="gray.700" // Background color of the repo boxes, use a lighter gray shade
            borderRadius="md" // Rounded corners for the boxes
            boxShadow="md" // Shadow for better visual separation
            transition="all 0.3s ease" // Smooth transition for hover effect
            _hover={{
                transform: 'translateY(-10px)', // Move box upwards on hover
                boxShadow: 'xl', // Increase shadow on hover
            }}
            cursor="pointer" // Indicates the box is clickable
            onClick={() => navigate(`/repos/${repo.name}`, { state: { repo, isNew: repo.isNew } })}
            width="100%" // Makes the boxes fill the available space
            height={repos.length> perPage ? (isSmallScreen ? 'auto' : '80px') : '130px'} // Automatically adjusts the height
            overflowY='auto' sx={{
                '&::-webkit-scrollbar': {
                    width: '10px', // Width of the scrollbar
                },
                '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'gray.500', // Color of the scrollbar thumb
                    borderRadius: 'full', // Round edges for the scrollbar thumb
                },
                '&::-webkit-scrollbar-track': {
                    backgroundColor: 'gray.300', // Color of the scrollbar track
                },
            }}
        >
            <Text fontWeight="bold">{repo.name}</Text>
            <Text fontSize="xs" color="gray.400" mt={2}>
                Click to view
            </Text>
        </Box>
    ))}
</VStack>

                {/* Pagination buttons */}
                <Box mt={2} display="flex" justifyContent="space-between">
                    <Button colorScheme="gray.700" onClick={() => handlePageChange(page - 1)} disabled={page <= 1} leftIcon={<ChevronLeftIcon/>}>
                        Prev
                    </Button>
                    <Text mx={4}>Page {page} </Text>
                    <Button colorScheme="gray.700" onClick={() => handlePageChange(page + 1)} disabled={!hasMore} rightIcon={<ChevronRightIcon/>}>
                        Next
                    </Button>
                </Box>

                {/* Button to open the CreateRepoModal */}
                <Button mt={isSmallScreen ? 1 : 2} 
  
                colorScheme="blue" onClick={openCreateModal}>
                    Create New Repository
                </Button>

                {/* CreateRepoModal component */}
                <CreateRepoModal
                    isOpen={isCreateModalOpen}
                    onClose={closeCreateModal}
                    addNewRepo={addNewRepo}
                    existingRepos={repos}
                />
            </Flex>
        </Flex>
    );
};

export default Home;