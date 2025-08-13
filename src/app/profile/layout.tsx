"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";

import {
  IconSettings,
  IconWallet,
  IconAnalyze,
  IconDashboard,
} from "@tabler/icons-react";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState("Username");
  const [open, setOpen] = useState(false);

  // Title per route
  const titles: Record<string, string> = {
    "/profile": "Dashboard",
    "/profile/userinput": "Inputs",
    "/profile/wallets": "Wallet Status",
    "/profile/analysis": "Analysis",
  };
  const currentTitle = titles[pathname] ?? "Dashboard";

  // Fetch username once
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const res = await axios.get("/api/users/me");
        setUsername(res.data.data.username || "User");
      } catch (err) {
        toast.error("Failed to fetch user data");
      }
    };
    fetchUsername();
  }, []);

  // Simple auth gate
  useEffect(() => {
    const token = getCookie("token");
    if (!token) router.push("/login");
  }, [router]);

  const logout = async () => {
    try {
      const res = await axios.get("/api/users/logout");
      if (res.data?.success) {
        toast.success(res.data.message || "Logged out");
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.error("An error occurred while logging out");
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "/profile",
      icon: <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Your Inputs",
      href: "/profile/userinput", // matches your folder name
      icon: <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Wallet Status",
      href: "/profile/wallets",
      icon: <IconWallet className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Analysis",
      href: "/profile/analysis",
      icon: <IconAnalyze className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
  ];

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-2 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-screen"
      )}
    >
      {/* Sidebar (constant) */}
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="flex flex-1" />
            <div className="mt-8 flex flex-3 flex-col gap-4">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div></div>
        </SidebarBody>
      </Sidebar>

      {/* Right side: header + page content */}
      <div className="flex flex-1 flex-col h-screen rounded-tl-2xl rounded-tr-2xl overflow-hidden border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        {/* Top navbar (constant, dynamic title) */}
        <header className="sticky top-0 z-10 bg-black p-6 border-b border-neutral-700 flex justify-between items-center rounded-tl-2xl rounded-tr-2xl">
          <h1 className="text-2xl font-bold text-white">{currentTitle}</h1>
          <div className="flex space-x-4">
            <span className="text-white font-medium text-2xl mt-1">user: {username} </span>
            <button
              onClick={logout}
              className="bg-slate-100 grid place-items-center py-2 px-4 rounded-full font-bold shadow-md"
            >
              Logout
            </button>
            <button className="bg-slate-100 grid place-items-center py-2 px-4 rounded-full font-bold shadow-md">
              Settings
            </button>
          </div>
        </header>

        {/* This area swaps per page */}
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image src="/startup_icon.ico" alt="Faida logo" width={30} height={30} className="shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Faida
      </motion.span>
    </Link>
  );
}
