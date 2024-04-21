// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import RepoDetails from "./components/RepoDetails";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFoundPage from "./components/NotFoundPage";
// import TestErrorPage from './components/TestError';
import { HelmetProvider } from 'react-helmet-async';


function App() {
  return (
    <HelmetProvider>
    <ChakraProvider>
      <Router>
      <ErrorBoundary>
     
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route path="/repos/:repoName" element={<RepoDetails/>} />
          {/* <Route path="/error" element={<ErrorBoundary/>} />  */}


          {/* <Route path="/test-error" element={<TestErrorPage/>} /> */}
          <Route path = "*" element={<NotFoundPage/>} />
        </Routes>
        
      </ErrorBoundary>
      </Router>
    </ChakraProvider>
    </HelmetProvider>
   
  );
}

export default App;
