import React from 'react'
import { Route, Routes } from 'react-router-dom';

import Layout from './components/layouts/Layout'
import HomePage from './pages/HomePage';
import SignUpPage from './pages/auth/SignUpPage';
import LoginPage from './pages/auth/LoginPage';

const App = () => {
  return <Layout>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/signup' element={<SignUpPage />} />
      <Route path='/login' element={<LoginPage />} />
    </Routes>
  </Layout>
}

export default App
