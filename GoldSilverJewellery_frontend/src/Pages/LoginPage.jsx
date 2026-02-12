import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    mobile: '',
    password: '',
  });
  const[error, setError] = useState("");
  const[loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  } 
  const handleSubmit = async(e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    
  }

  return (
    <div>LoginPage</div>
  )
}

export default LoginPage