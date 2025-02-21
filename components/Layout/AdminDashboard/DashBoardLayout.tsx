import React from "react";
import AdminSideNavBar from "./SideNavBar/SideNavBar";
import AdminNavbar from "./NavBar/Navbar";

type Props = { children: React.ReactNode };

function DashBoardLayout({ children }: Props) {
  return (
    <div className="flex h-screen">
      <div className="hidden sm:flex">
        <AdminSideNavBar />
      </div>

      <div className="flex-1 h-screen overflow-y-scroll  ">
        <AdminNavbar />
        <div> {children}</div>
      </div>
    </div>
  );
}

export default DashBoardLayout;
