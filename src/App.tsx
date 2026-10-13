import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import Menu from '@/pages/Menu';
import Dashboard from '@/pages/Dashboard';
import Tables from '@/pages/Tables';
import Orders from '@/pages/Orders';
import Feedback from '@/pages/Feedback';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import NotFound from '@/pages/NotFound';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1c1c22',
            border: '1px solid #3a3a47',
            color: '#faf5eb',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tables" element={<Tables />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/feedback" element={<Feedback />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
