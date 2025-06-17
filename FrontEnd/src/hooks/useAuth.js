import { useContext } from 'react';
import { AuthContext } from '../services/providers/authProvider';

export const useAuth = () => {
    return useContext(AuthContext);
};