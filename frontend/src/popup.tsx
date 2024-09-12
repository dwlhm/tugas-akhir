import { PropsWithChildren, createContext, useContext, useState } from "react";

export interface PopupContextInterface {
  el: JSX.Element | null;
  setPopup: (el: JSX.Element) => void;
  close: (state: boolean) => void;
}

const PopupContext = createContext<PopupContextInterface | null>(null);

export const PopupProvider = ({ children }: PropsWithChildren) => {
  const [el, setEl] = useState<JSX.Element | null>(null);

  const setPopup = (item: JSX.Element) => {
    setEl(
      <div className="fixed inset-0 flex justify-center items-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => close(true)}></div>
        {item}
      </div>
    );
  };

  const close = (state: boolean) => {
    if (state) setEl(<></>);
  };

  return (
    <PopupContext.Provider value={{ el, setPopup, close }}>
      {children}
    </PopupContext.Provider>
  );
};

export function usePopup() {
  const context = useContext(PopupContext);
  if (!context)
    throw new Error("usePopup must be used within an PopupProvider");
  return context;
}
