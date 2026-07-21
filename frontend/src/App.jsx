import ShowProfile from "./components/ShowProfile"
import AppRoutes from "./Routes/routes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

function App() {

  return (
    <>
      <TooltipProvider>
        <main className="min-h-screen">
          <ShowProfile />
          <AppRoutes />
          <Toaster position="top-center" visibleToasts={5}/>
        </main>
      </TooltipProvider>
    </>
  )
}

export default App
