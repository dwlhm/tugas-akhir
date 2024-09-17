import { ReactNode } from "react";

export const QuickViewCard = (props: {
  name: string;
  topBar: ReactNode;
  noLeftDecoration?: boolean;
  children: ReactNode;
}) => {
  return (
    <div className="mb-2 p-2 bg-white flex gap-2 rounded border-2 border-solid border-white hover:border-blue-900">
      {props.noLeftDecoration ? (
        <></>
      ) : (
        <div className="bg-blue-100 p-1 rounded"></div>
      )}
      <div>
        <div className="flex gap-4">
          <p className="text-lg">{props.name}</p>
          {props.topBar}
        </div>
        {props.children}
      </div>
    </div>
  );
};
