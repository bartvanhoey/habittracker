import React, { createContext, useContext, useState } from "react";

const BumpVersionContext = createContext({
  habitVersion: 0,
  bumpHabit: () => {},
  // habitVersion1: 0,
  // bumpHabit1: () => {},
});

export const BumpVersionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [habitVersion, setHabitVersion] = useState(0);
  const bumpHabit = () => setHabitVersion((v) => v + 1);
  // const [habitVersion1, setHabitVersion1] = useState(0)
  // const bumpHabit1 = () => setHabitVersion1((v) => v+1);

  // return <BumpVersionContext.Provider value={{habitVersion, bumpHabit, habitVersion1, bumpHabit1}} >
  return (
    <BumpVersionContext.Provider value={{ habitVersion, bumpHabit }}>
      {children}
    </BumpVersionContext.Provider>
  );
};

export const useBumpVersion = () => useContext(BumpVersionContext);
