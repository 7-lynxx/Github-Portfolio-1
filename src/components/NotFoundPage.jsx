import { Box, Heading, Text, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Box
            width="100%" // Full width of the viewport
            height="100vh" // Full height of the viewport
            display="flex"
            flexDirection="column"
            justifyContent="center" // Vertically center the content
            alignItems="center" // Horizontally center the content
            backgroundImage="url('./src/assets/images/404.jpg')" // Specify the path to your image
            backgroundSize="cover" // Make the image cover the entire Box
            backgroundPosition="center" // Center the image
            bgRepeat="no-repeat" // Don't repeat the image
        >
            <Heading as="h1" size="xl" mb={4} color="red">
                404 - Page Not Found
            </Heading>
            <Text mb={40}  fontWeight="black" fontSize="xl" color="purple.500">
                Sorry, the page you are looking for does not exist.
            </Text>
            <Button onClick={() => navigate('/')} colorScheme="blue">
                Go to Home
            </Button>
        </Box>
    );
};

export default NotFound;