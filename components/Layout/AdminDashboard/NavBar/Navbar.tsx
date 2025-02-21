"use client";
import { handleSignOut } from "@/app/actions/authActions";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { LuLogOut } from "react-icons/lu";
import AdminSideNavBar from "../SideNavBar/SideNavBar";

type Props = {};

export default function AdminNavbar({ }: Props) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => setOpen(!open);
  const [verifyToken, setVerifyToken, removeVerifyToken] = useLocalStorage<string | null>("verifyToken", null);
  const [otpToken, setOtpToken, removeOtpToken] = useLocalStorage<string | null>("otpToken", null);

  const handleLogout = async () => {
    setIsLoading(true);
    handleSignOut();
    removeOtpToken();
    removeVerifyToken();
  };

  return (
    <div className="sticky top-0 z-50 bg-[#fff] dark:bg-[#24303f] px-5 py-4 w-full  border-b dark:border-b-0">
      <div className="w-full  flex justify-between   items-center ">
        <button
          className="font-medium  focus:outline-none  sm:hidden  "
          type="button"
          data-drawer-target="drawer-navigation"
          data-drawer-show="drawer-navigation"
          aria-controls="drawer-navigation"
          onClick={toggle}
        >
          <IoMdMenu />
        </button>
        <div className=" flex items-center justify-center flex-row gap-6">
          <div
            className="cursor-pointer"
            onClick={handleLogout}
          >
            <h1 className=" flex items-center sm:hidden gap-2">
              {isLoading ? (
                <span>Logging out...</span>
              ) : (
                <>
                  <span>Logout</span>
                  <LuLogOut />
                </>
              )}
            </h1>
          </div>
        </div>
      </div>
      <div
        className={`fixed sm:hidden transition-transform  ${open ? " bg-black bg-opacity-50" : "hidden"
          } top-0 left-0 bottom-0  right-0 `}
        onClick={toggle}
      >
        <div className="max-w-fit">
          <AdminSideNavBar />
        </div>
      </div>
    </div>
  );
}
