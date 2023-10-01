"use client";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  HomeIcon,
  XMarkIcon,
  LockOpenIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import classNames from "@/utils/classNames";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { ShieldCheckIcon, UserIcon } from "@heroicons/react/24/solid";
const navItems = (loggedIn: boolean, level: number, current: string) => [
  {
    name: "Login",
    href: "/auth/login",
    icon: LockOpenIcon,
    current: current.includes("/auth/login"),
    visible: !loggedIn,
    requiredLevel: 0,
  },
  {
    name: "Register",
    href: "/auth/register",
    icon: UserPlusIcon,
    current: current.includes("/auth/register"),
    visible: !loggedIn,
    requiredLevel: 0,
  },
  {
    name: "Dashboard",
    href: "/",
    icon: HomeIcon,
    current: current === "/",
    visible: loggedIn && level > 0,
    requiredLevel: 1,
  },
  {
    name: "Profile",
    href: "/user/profile/",
    icon: UserIcon,
    current: current.includes("/user/profile"),
    visible: loggedIn && level > 0,
    requiredLevel: 1,
  },

  {
    name: "Admin Dashboard",
    href: "/admin/dashboard",
    icon: ShieldCheckIcon,
    current: current.includes("/admin"),
    visible: loggedIn && level > 1,
    requiredLevel: 2,
  },
];

const secondaryNavigationItems = (
  loggedIn: boolean,
  level: number,
  current: string,
) => [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    current: current === "/admin/dashboard",
    visible: loggedIn && level > 1 && current.includes("/admin"),
  },
  {
    name: "Site Settings",
    href: "/admin/site_settings",
    current: current.includes("/admin/site_settings"),
    visible: loggedIn && level > 2 && current.includes("/admin"),
  },
  {
    name: "User List",
    href: "/admin/user_list",
    current: current.includes("/admin/user_list"),
    visible: loggedIn && level > 1 && current.includes("/admin"),
  },
  {
    name: "Course List",
    href: "#",
    current: current.includes("/admin/course_list"),
    visible: loggedIn && level > 1 && current.includes("/admin"),
  },
  {
    name: "Add Course",
    href: "/admin/add_course",
    current: current.includes("/admin/add_course"),
    visible: loggedIn && level > 1 && current.includes("/admin"),
  },
];

const Navbar: React.FC<{
  children: React.ReactNode;
  response: any;
  siteLogo: any;
}> = ({ children, response, siteLogo }) => {
  const [auth, setAuth] = useState(response);
  const router = useRouter();
  const pathName = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigation = navItems(auth.ok, auth.level, pathName);
  const secondaryNavigation = secondaryNavigationItems(
    auth.ok,
    auth.level,
    pathName,
  );

  async function getLoggedIn() {
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL_BASE + "/check_logged_in",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      },
    );
    const returnObject = {
      ok: false,
      level: 0,
      name: "",
      avatar: "",
    };
    returnObject.ok = res.ok;
    const data = await res.json();
    if (res.ok) {
      returnObject.level = data.level;
      returnObject.name = data.name;
      returnObject.avatar = data.avatar;
    }
    return returnObject;
  }

  useEffect(() => {
    getLoggedIn()
      .then((data) => {
        if (!data.ok && !pathName.includes("auth")) {
          router.push("/auth/login");
        }
        setAuth(data);
      })
      .catch(() => {
        if (!pathName.includes("auth") || pathName !== "/") {
          router.push("/auth/login");
        }
      });
  }, [pathName, router]);
  return (
    <>
      <div className={"h-full"}>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 xl:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      {siteLogo?.site_logo && !siteLogo?.text_over_logo ? (
                        <img
                          className="h-8 w-auto"
                          src={siteLogo.site_logo}
                          alt="Your Company"
                        />
                      ) : (
                        <h1 className="text-2xl font-bold text-white">
                          {siteLogo.site_name}
                        </h1>
                      )}
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map(
                              (item) =>
                                item.visible && (
                                  <li key={item.name}>
                                    <Link
                                      onClick={() => setSidebarOpen(false)}
                                      href={item.href}
                                      className={classNames(
                                        item.current
                                          ? "bg-accent text-white"
                                          : "text-indigo-200 hover:text-white hover:bg-accent",
                                        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                                      )}
                                    >
                                      <item.icon
                                        className={classNames(
                                          item.current
                                            ? "text-white"
                                            : "text-indigo-200 group-hover:text-white",
                                          "h-6 w-6 shrink-0",
                                        )}
                                        aria-hidden="true"
                                      />
                                      {item.name}
                                    </Link>
                                  </li>
                                ),
                            )}
                          </ul>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Sidebar for Desktop */}
        <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/20 px-6 ring-1 ring-white/5">
            <div
              className={classNames(
                !siteLogo?.text_over_logo ? "h-20 w-full pt-5" : "h-16",
                "flex h-16 shrink-0 items-center",
              )}
            >
              {siteLogo?.site_logo && !siteLogo?.text_over_logo ? (
                <Link href={"/"}>
                  <Image
                    src={siteLogo.site_logo}
                    alt="Your Company"
                    height={135}
                    width={135}
                    className={"w-full"}
                    quality={85}
                    priority={true}
                  />
                </Link>
              ) : (
                <Link href={"/"}>
                  <h1 className="text-2xl font-bold text-white">
                    {siteLogo.site_name}
                  </h1>
                </Link>
              )}
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map(
                      (item) =>
                        item.visible && (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? "bg-accent text-white"
                                  : "text-indigo-200 hover:text-white hover:bg-accent",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold",
                              )}
                            >
                              <item.icon
                                className={classNames(
                                  item.current
                                    ? "text-white"
                                    : "text-indigo-200 group-hover:text-white",
                                  "h-6 w-6 shrink-0",
                                )}
                                aria-hidden="true"
                              />
                              {item.name}
                            </Link>
                          </li>
                        ),
                    )}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto">
                  <Link
                    href="/user/profile/"
                    className="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white hover:bg-accent"
                  >
                    <Image
                      className="h-12 w-12 rounded-full bg-accent"
                      src={
                        auth.avatar
                          ? auth.avatar
                          : `/avatars/avatar-${siteLogo.rAvatar}.png`
                      }
                      alt="avatar"
                      width={64}
                      height={64}
                    />
                    <span className="sr-only">Your profile</span>
                    <span aria-hidden="true">
                      {auth.name ? auth.name : "Login"}
                    </span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Profile/Admin Navigation bar */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-primary px-4 py-4 shadow-sm sm:px-6 xl:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-indigo-200 xl:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white" />
          <Link href="/user/profile/">
            <span className="sr-only">Your profile</span>
            <Image
              className="h-10 w-10 rounded-full bg-accent"
              src={
                auth.avatar
                  ? auth.avatar
                  : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              }
              alt="avatar"
              width={64}
              height={64}
            />
          </Link>
        </div>
        {pathName.includes("/admin") || pathName.includes("/profile") ? (
          <div className="xl:pl-72">
            <main>
              <header className="border-b border-white/5">
                {/* Secondary navigation */}
                <nav className="flex overflow-x-auto py-4">
                  <ul
                    role="list"
                    className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
                  >
                    {secondaryNavigation.map(
                      (item) =>
                        item.visible && (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                item.current ? "text-indigo-400" : "",
                                "xl:hover:bg-accent hover:text-white xl:rounded-xl xl:p-2",
                              )}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ),
                    )}
                  </ul>
                </nav>
              </header>
              {}
              {/* Settings forms // profile & admin */}
              <main className="py-10 h-full">
                <div className="px-4 sm:px-6 lg:px-8 h-full">{children}</div>
              </main>
            </main>
          </div>
        ) : (
          <main className="py-10 xl:pl-72 h-full">
            <div className="px-4 sm:px-6 lg:px-8 h-full">{children}</div>
          </main>
        )}
      </div>
    </>
  );
};
export default Navbar;
