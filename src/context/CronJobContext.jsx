import React, { createContext, useContext, useState } from 'react';

const CronJobContext = createContext();

export const useCronJob = () => {
  return useContext(CronJobContext);
};

export const CronJobProvider = ({ children }) => {
  const [selectedCronJobId, setSelectedCronJobId] = useState(null);

  return (
    <CronJobContext.Provider value={{ selectedCronJobId, setSelectedCronJobId }}>
      {children}
    </CronJobContext.Provider>
  );
};
