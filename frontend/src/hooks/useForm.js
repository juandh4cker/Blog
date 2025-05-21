import { useState } from 'react';

export const useForm = (initialFormData) => {
  const [formData, setFormData] = useState(initialFormData);

  const setInputData = (name) => ({
    name: name,
    value: formData[name] || '',
    onChange: (e) => setFormData(prev => ({
      ...prev,
      [name]: e.target.value
    }))
  });

  return { formData, setFormData, setInputData };
};