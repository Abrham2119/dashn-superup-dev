"use client";
import { handleSignOut } from "@/app/actions/authActions";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ReactElement, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { MdDashboard } from "react-icons/md";
import { RiProfileFill } from "react-icons/ri";

type MenuItem = {
  id: number;
  label: string;
  href: string;
  subMenu?: MenuItem[];
  icon: ReactElement;
};
type Props = {};

function AdminSideNavBar({ }: Props) {
  const { data: session } = useSession();
  const [openedItems, setOpenedItems] = useState<number[]>([]);
  const [verifyToken, setVerifyToken, removeVerifyToken] = useLocalStorage<string | null>("verifyToken", null);
  const [otpToken, setOtpToken, removeOtpToken] = useLocalStorage<string | null>("otpToken", null);
  const [isLoading, setIsLoading] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      label: "Dashboard",
      href: "/dashboard/checker",
      icon: <MdDashboard />,
    },
    {
      id: 6,
      label: "Profile",
      href: "/dashboard/checker/profile",
      icon: <RiProfileFill />,
    },
  ];

  const img = session?.user.image;
  const fullName = session?.user.fullname;
  const IMG_URL = process.env.NEXT_PUBLIC_IMG_URL;
  const [firstName, lastName] =
    fullName && fullName !== "undefined" ? fullName.split(" ") : ["", ""];
  const patientProfileUrl =
    img && img !== "undefined" ? `${IMG_URL}${img}` : "";
  const doctorInitials = `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`;

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await handleSignOut();
      removeOtpToken();
      removeVerifyToken();
    } catch (error) {
      console.error("Error during sign out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen z-50 pb-9 bg-white dark:bg-[#24303f] px-5 flex flex-col">
      <div className="pt-4">
        <Link href="/" className="flex items-center rtl:space-x-reverse">
          <Image
            src="/Dashen-Bank-Logo.png"
            className="h-auto text-center w-full max-w-28"
            alt="dashin-image"
            width={50}
            height={50}
          />
        </Link>
      </div>
      <div className="flex flex-col flex-grow justify-between">
        <div>
          <ul className="pb-10 pt-6 space-y-2 font-medium">
            {menuItems.map((menuItem, index) => (
              <li key={index}>
                {menuItem.subMenu != undefined ? (
                  <button
                    type="button"
                    className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      const index = openedItems.findIndex(
                        (item) => item == menuItem.id
                      );
                      if (index != -1) {
                        setOpenedItems((prev) =>
                          prev.filter((item) => item !== menuItem.id)
                        );
                      } else {
                        setOpenedItems((prev) => [...prev, menuItem.id]);
                      }
                    }}
                  >
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 21"
                    >
                      <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                    </svg>
                    <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap mr-5">
                      {menuItem.label}
                    </span>
                    {openedItems.includes(menuItem.id) ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                ) : (
                  <Link
                    href={menuItem.href}
                    className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                  >
                    {menuItem.icon}
                    <span className="ms-3">{menuItem.label}</span>
                  </Link>
                )}

                {menuItem.subMenu && (
                  <ul
                    className={`${openedItems.includes(menuItem.id) ? "" : "hidden"
                      } py-2 space-y-2`}
                  >
                    {menuItem.subMenu.map((subMenuItem, subIndex) => (
                      <li key={subIndex}>
                        <Link
                          href={subMenuItem.href}
                          className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                        >
                          {subMenuItem.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-full flex flex-row items-center justify-center">
            <div className="mr-2">
              {patientProfileUrl !== "" ? (
                <Image
                  height={50}
                  width={50}
                  className="h-14 w-14 rounded-full object-cover"
                  src={`${IMG_URL}${img}`}
                  alt="Doctor Photo"
                />
              ) : (
                <div className="h-14 w-14 tracking-widest bg-gray-500 text-white text-xl rounded-full flex items-center justify-center text-center border my-0">
                  {doctorInitials}
                </div>
              )}
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="text-sm">{session?.user.fullname}</div>
              <div className="text-sm">{session?.user.roleId} </div>
            </div>
          </div>
          <div
            className="cursor-pointer"
            onClick={handleLogout}
          >
            <h1 className="items-center hidden sm:flex gap-2">
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
    </div>
  );
}

export default AdminSideNavBar;