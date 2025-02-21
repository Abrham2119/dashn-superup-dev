import React from "react";
import DashBoardLayout from "@/components/Layout/AdminDashboard/DashBoardLayout";

type Props = {
  children: React.ReactNode;
};
const layout = ({ children }: Props) => {
  return (
    <DashBoardLayout>
      <div className="lg:p-6 md:p-3 p-1">
        <div className="lg:p-6 md:p-3 p-1 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
          {children}
        </div>
      </div>
    </DashBoardLayout>
  );
};

export default layout;
