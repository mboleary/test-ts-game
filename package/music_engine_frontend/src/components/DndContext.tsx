import { createContext, ReactElement, useContext, useState } from 'react';

export const DnDContext = createContext<[string, (_: string) => void]>(['', (_: string) => {}]);

export type DndProviderProps = {
    children: ReactElement | ReactElement[]
};

export const DnDProvider = ({ children }: DndProviderProps) => {
  const [type, setType] = useState<string>('');

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
}

export const useDnD = () => {
  return useContext(DnDContext);
}
