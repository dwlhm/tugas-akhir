import { PropsWithChildren, createContext, useContext, useState } from "react";

export interface PopupData<T> {
  data: T;
}

export interface PopupContextInterface<T> {
  el: JSX.Element | null;
  data: T;
  setPopup: (el: JSX.Element) => void;
  close(item: T): T;
}

const PopupContext = createContext<PopupContextInterface<any> | null>(null);

export function PopupProvider<T>({ children }: PropsWithChildren) {
  const [el, setEl] = useState<JSX.Element | null>(null);
  const [data, setData] = useState<T | null>(null);

  const setPopup = (item: JSX.Element) => {
    setEl(
      <div className="fixed inset-0 flex justify-center items-center">
        <div
          className="absolute inset-0 bg-black/50 z-0"
          onClick={() => setEl(<></>)}
        ></div>
        <div className="z-10">{item}</div>
      </div>
    );
  };

  function close(data: T) {
    setEl(<></>);
    setData(data);
  }

  return (
    <PopupContext.Provider value={{ el, data, setPopup, close }}>
      {children}
    </PopupContext.Provider>
  );
}

export function usePopup<T>(): PopupContextInterface<T> {
  const context = useContext(PopupContext);
  if (!context)
    throw new Error("usePopup must be used within an PopupProvider");
  return context as PopupContextInterface<T>;
}
