"use client";

import { LogOutIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { logoutRouteAction } from "@/actions/logout-route-action";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function UserBlock() {
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("excaliUsername");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const result = await logoutRouteAction();
      if (result.success) {
        localStorage.removeItem("excaliWsToken");
        localStorage.removeItem("excaliUsername");
        router.push("/home");
        router.refresh();
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  // Get initials from username
  const getInitials = (name: string) => {
    return name
      .split('@')[0] // Remove email domain if present
      .split(/[^a-zA-Z]/) // Split on non-letters
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed top-4 left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-auto gap-2 px-3 hover:bg-gray-100 active:scale-95 transition-all">
            <Avatar className="h-7 w-7 transition-transform">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-xs">
                {username ? getInitials(username) : "U"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-gray-700 hidden sm:inline">
              {username ? username.split('@')[0] : 'User'}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-8">
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 ">
            <LogOutIcon/>
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
} 