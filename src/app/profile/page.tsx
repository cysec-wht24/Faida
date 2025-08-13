"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../../components/ui/sidebar";
import { IconArrowLeft, IconSettings, } from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "../../../lib/utils";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";

// Optional, maybe should be in route.ts of profile
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export default function SidebarDemo() {
  const router = useRouter();
  const [username, setUsername] = useState("Username");

  // Fetch username from the /api/users/me endpoint
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await axios.get("/api/users/me");
        setUsername(response.data.data.username); // Update the username state
      } catch (error: any) {
        console.error("Error fetching username:", error.message);
        toast.error("Failed to fetch user data");
      }
    };

    fetchUsername();
  }, []); // This runs only once when the component mounts

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const logout = async () => {
    try {
      console.log("Calling logout API..."); // Debug log
      const response = await axios.get("/api/users/logout");
      console.log("Logout API response:", response.data); // Debug log

      if (response.data.success) {
        toast.success(response.data.message);
        router.push("/");
      } else {
        toast.error("Logout failed");
      }
    } catch (error: any) {
      console.error("Logout error:", error.message);
      toast.error("An error occurred while logging out");
    }
  };

  const links = [
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className={cn("mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800 h-screen")}>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard logout={logout} username={username}/>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <Image
        src="/startup_icon.ico" // Place the file in /public
        alt="Faida logo"
        width={30} // Adjust size
        height={30}
        className="shrink-0"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white">
        Faida
      </motion.span>
    </Link>
  );
};

const Dashboard = ({ logout, username}: { logout: () => void, username: string}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Navigate to the workspace
  const handleEdit = (id: string) => {
    router.push(`/profile/workspace?id=${id}`);
  };

  return (
    <div className="flex flex-1 flex-col h-screen rounded-tl-2xl rounded-tr-2xl overflow-hidden border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
      {/* Navbar */}
      <header className="sticky top-0 z-10 bg-black p-6 border-b border-neutral-700 flex justify-between items-center rounded-tl-2xl rounded-tr-2xl">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex space-x-4">
          <span className="text-white font-medium text-2xl mt-1 mr-">
            Hello {username} !!
          </span>
          <button
            onClick={logout}
            className="bg-slate-100 grid place-items-center py-2 px-4 rounded-full font-bold shadow-md">
            Logout
          </button>
          <button
            
            className="bg-slate-100 grid place-items-center py-2 px-4 rounded-full font-bold shadow-md">
            Settings
          </button>
          
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        
      </div> // can make it main for SEO
    </div>
  );
};
