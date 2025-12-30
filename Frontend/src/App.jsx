import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ArticleDetail from './pages/ArticleDetail';
import ArticleForm from './components/ArticleForm';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/articles/new" element={<ArticleForm />} />
          <Route path="/articles/:id" element={<ArticleDetail />} />
          <Route path="/articles/:id/edit" element={<ArticleForm />} />
        </Routes>
      </Layout>
      <Toaster position="top-right" toastOptions={{
        className: 'text-sm font-medium text-gray-900',
        duration: 4000,
        style: {
          background: '#fff',
          color: '#363636',
        },
        success: {
          style: {
            borderLeft: '4px solid #10B981',
          }
        },
        error: {
          style: {
            borderLeft: '4px solid #EF4444',
          }
        }
      }} />
    </Router>
  );
}

export default App;
