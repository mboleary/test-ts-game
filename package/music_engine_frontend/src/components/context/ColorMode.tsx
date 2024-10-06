import { ColorMode } from '@xyflow/react';
import { createContext, ReactElement, useContext, useState } from 'react';

export const ColorModeContext = createContext<[ColorMode, (_: ColorMode) => void]>(['system', (_: ColorMode) => {}]);

export type ColorModeProviderProps = {
    children: ReactElement | ReactElement[]
};

export const ColorModeProvider = ({ children }: ColorModeProviderProps) => {
  const [mode, setMode] = useState<ColorMode>('system');

  return (
    <ColorModeContext.Provider value={[mode, setMode]}>
      {children}
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => {
  return useContext(ColorModeContext);
}
