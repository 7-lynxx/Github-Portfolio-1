import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
// import { useNavigate } from "react-router-dom"; // Ensure import from 'react-router-dom'
import { Box, Button, Heading, Text } from "@chakra-ui/react";

const ErrorBoundary = ({ children }) => {
    const [hasError, setHasError] = useState(false);
    // const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const errorHandler = () => {
            setHasError(true);
        };

        window.addEventListener("error", errorHandler);

        return () => {
            window.removeEventListener("error", errorHandler);
        };
    }, []);

    const reloadPage = () => {
      window.location.reload();
    };

    if (hasError) {
        return (
            <Box
            width="100%" // Full width of the viewport
            height="100vh" // Full height of the viewport
            display="flex"
            flexDirection="column"
            justifyContent="center" // Vertically center the content
            alignItems="center" // Horizontally center the content
            backgroundImage="url('/assets/error.jpg')" // Specify the path to your image
            backgroundSize="cover" // Make the image cover the entire Box
            backgroundPosition="center" // Center the image
            bgRepeat="no-repeat" // Don't repeat the image
        >
            <Heading as="h1" size="xl" mb={4} color="red.500">
               Something went wrong.
            </Heading>
            <Text mb={40}  fontWeight="black" fontSize="xl" color="blue.500">
                Click the button below to refresh back home
            </Text>
            <Button onClick={ reloadPage}>
                Refresh Page
            </Button>
        </Box>
        );
    }

    return children;
};

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ErrorBoundary;