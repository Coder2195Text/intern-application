import { FC, ReactNode } from "react";
import { BiErrorCircle } from "react-icons/bi";

interface ErrorProps {
  children: ReactNode;
}

const Error: FC<ErrorProps> = ({ children }) => {
  return (
    <div className="flex justify-center items-center bg-red-300 rounded-lg">
      <BiErrorCircle className="w-6 h-6" color="#dd0000" />
      <span className="text-red-900">Error: {children}</span>
    </div>
  );
};

export default Error;
