import React from "react";

export interface Timestamp {
  startTime: number;
  endTime: number;
  title: string;
}

interface State {
  timestamps: Timestamp[];
}

interface ContextProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const CustomVideoStateContext = React.createContext<ContextProps | null>(null);

const defaultState: State = {
  timestamps: [],
};

export const CustomVideoStateContextProvider: any = ({ children }: any) => {
  const [state, setState] = React.useState<State>(defaultState);

  return (
    <CustomVideoStateContext.Provider value={{ state, setState }}>
      {children}
    </CustomVideoStateContext.Provider>
  );
};

export const useCustomVideoState = () => {
  return React.useContext(CustomVideoStateContext);
};
