// import React from "react";

// export interface Timestamp {
//   startTime: number;
//   endTime: number;
//   title: string;
// }

// interface State {
//   timestamps: Timestamp[];
// }

// interface ContextProps {
//   state: State;
//   setState: React.Dispatch<React.SetStateAction<State>>;
// }

// const CustomVideoStateContext = React.createContext<any>(null);

// const defaultState: State = {
//   timestamps: [],
// };

// export const CustomVideoStateContextProvider: any = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [state, setState] = React.useState<State>(defaultState);

//   return (
//     <CustomVideoStateContext.Provider value={{ state, setState }}>
//       {children}
//     </CustomVideoStateContext.Provider>
//   );
// };

// export const useCustomVideoState = () => {
//   return React.useContext(CustomVideoStateContext);
// };
