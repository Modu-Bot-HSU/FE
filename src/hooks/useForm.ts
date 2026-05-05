import { useState } from "react";

export const useForm = <T>(initialState: T) => {
  const [values, setValues] = useState<T>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return { values, handleChange, setValues };
};
