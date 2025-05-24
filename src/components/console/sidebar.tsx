"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  Moon,
  Sun,
  Github,
  Cloud,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useTheme } from "next-themes"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const navItems = [
    {
      title: "Dashboard",
      href: "/console",
      icon: LayoutDashboard,
    },
    {
      title: "Repositories",
      href: "/console/repos",
      icon: Github,
    },
    {
      title: "Cloud",
      href: "/console/manage-cloud",
      icon: Cloud,  
    },
    {
      title: "Settings",
      href: "/console/settings",
      icon: Settings,
    },
  ]

  return (
    <aside
      className={cn(
        "relative flex h-screen flex-col bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4">
        {!isCollapsed && <h2 className="text-lg font-semibold">Console</h2>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">{item.title}</span>}
            </Button>
          </Link>
        ))}
      </nav>
      {
        isCollapsed&&
      <div className="p-2 ">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "w-full",
            isCollapsed ? "justify-center" : "justify-end gap-6"
          )}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <div className="relative h-5 w-5">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-0 left-0 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </div>
        </Button>
      </div>

      }

      {/* User Profile */}
      <div className="p-2 border-t">
        <ProfileMenu isCollapsed={isCollapsed} />
      </div>

    </aside>
  )
} 


export const ProfileMenu = ({ isCollapsed }: { isCollapsed: boolean }) => {
    const { data: session ,status} = useSession();
  if(status === "loading") return null;
  if(status === "unauthenticated") return null;
  const user = session?.user;
  if(!user) return null;
  const { name, email, image } = user;
  
  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Avatar className="h-6 w-6">
          <AvatarImage src={image} alt="User" />
          <AvatarFallback>{name?.charAt(0)}</AvatarFallback>
        </Avatar>   
        {!isCollapsed && <span className="ml-2">{name}</span>}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem className="text-red-600">
        <LogOut className="mr-2 h-4 w-4" />
        <span>Log out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  )
}