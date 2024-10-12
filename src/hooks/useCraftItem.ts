import { useState } from 'react';
import axios from 'axios';
import { ECRAFTABLE_ITEM } from '../components/interfaces/craftableItem.interface';
import axiosInstance from "../api/axiosConfig";
import { IUserInfo } from '../components/interfaces/user.interface';

export const useCraftItem = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const craftItem = async (
    itemId: ECRAFTABLE_ITEM, 
    quantity: number,
    setUserInfo: React.Dispatch<React.SetStateAction<IUserInfo>>
  ) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { data } = await axiosInstance.post<IUserInfo>('/labs/craft-item', { itemId, quantity });
      setUserInfo(data);
      setSuccessMessage(`Successfully crafted ${quantity} ${itemId}(s)`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data?.message || err.message;
        setError(message);
      } else {
        setError('Failed to craft item. Please try again.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { craftItem, loading, error, successMessage };
};
