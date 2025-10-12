import * as React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, FileText, BarChart2, Settings, Building2 } from "lucide-react";

import { cn } from "@/lib/utils";

const navLinks = [
  { icon: LayoutDashboard, text: "Dashboard", path: "/" },
  { icon: User, text: "Doctors", path: "/doctors" },
  { icon: FileText, text: "Documents", path: "/documents" },
  { icon: BarChart2, text: "Insights", path: "/insights" },
  { icon: Settings, text: "Profile", path: "/profile" },
]

const SidebarContext = React.createContext()

const Sidebar = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "data-[state=open]:w-72 data-[state=closed]:w-16 group/sidebar-wrapper relative flex h-full w-72 flex-col z-50",
        className
      )}
      {...props}
    />
  )
})
Sidebar.displayName = "Sidebar"

const SidebarProvider = ({ children }) => {
  return (
    <SidebarContext.Provider value={{}}>
      {children}
    </SidebarContext.Provider>
  )
}

const SidebarTrigger = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=open]:bg-accent",
        className
      )}
      {...props}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarHeader.displayName = "SidebarHeader"

const SidebarContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
      className
    )}
    {...props}
  />
))
SidebarContent.displayName = "SidebarContent"

const SidebarFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
))
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...props}
  />
))
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70",
      className
    )}
    {...props}
  />
))
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("group/menu-item flex w-full min-w-0", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? "div" : "button"
  return (
    <Comp
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
}