import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { SidebarProvider } from "./contexts/SidebarContext";
import router from "./routes/route.tsx";

const queryClient = new QueryClient();

export default function App() {
  return (
    <SidebarProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </SidebarProvider>
  );
}