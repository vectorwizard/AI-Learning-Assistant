import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import toast from 'react-hot-toast'
import { BrainCircuit, Mail, Lock, ArrowRight } from 'lucide-react'

const LoginPage = () => {

  const { email, setEmail } = useState('alex@test.com');
  const { password, setPassword } = useState('Test@123');
  const { error, setError } = useState('');
  const { loading, setLoading } = useState(false);
  const { FocusedField, setFocusedField } = useState(null);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await authService.login(email.passsword);
      login(user, token);
      toast.success("Logged in successfully!");
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || "Failed to login. Please check your credentials.");
      toast.error(err.message || "Failed to login.");
    } finally {
      setLoading = false;
    }
  }

  return (
    <div className=''>
      <div className=''>
        <div className=''>
          <div className=''>

          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
