import React from "react";

interface State {
  isCommunicationBarOpen: boolean;
}

interface ContextProps {
  state: State;
  setState: React.Dispatch<React.SetStateAction<State>>;
}

const RoomStateContext = React.createContext<ContextProps | null>(null);

const defaultState: State = {
  isCommunicationBarOpen: true,
};

export const RoomStateContextProvider = ({ children }: any) => {
  const [state, setState] = React.useState<State>(defaultState);

  console.log("chamado", state);

  return (
    <RoomStateContext.Provider value={{ state, setState }}>
      {children}
    </RoomStateContext.Provider>
  );
};

export const useRoomState = () => {
  return React.useContext(RoomStateContext);
};
