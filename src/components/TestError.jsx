import React from 'react';

const TestErrorPage = () => {
    throw new Error('Intentional error to test error boundary');
};

export default TestErrorPage;