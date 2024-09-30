import { useState } from 'react';
import { ECRAFTABLE_ITEM } from '../components/interfaces/craftableItem.interface';
import axiosInstance from "../api/axiosConfig";

export const useCraftItem = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const craftItem = async (itemId: ECRAFTABLE_ITEM, quantity: number) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await axiosInstance.post('/labs/craft-item', { itemId, quantity });
      setSuccessMessage(`Successfully crafted ${quantity} ${itemId}(s)`);
      return response.data;
    } catch (err) {
      setError('Failed to craft item. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { craftItem, loading, error, successMessage };
};