import { useState, useCallback } from 'react';

export const useRefreshTrigger = () => {

 const [refreshTrigger, setRefreshTrigger] = useState(0);

 const triggerRefresh = useCallback(() => {

   setRefreshTrigger(prev => prev + 1);

 }, []);

 return {

   refreshTrigger,

   triggerRefresh

 };

};
 