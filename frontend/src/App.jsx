import AppRoutes from "./Routes/routes"
import { TooltipProvider } from "@/components/ui/tooltip"

function App() {

  return (
    <>
      <TooltipProvider>
        <main className="min-h-screen">
          <AppRoutes />
        </main>
      </TooltipProvider>
    </>
  )
}

export default App
