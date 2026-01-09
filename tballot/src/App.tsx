import { Route, Routes, Navigate } from "react-router-dom"
import Home from "./Pages/home"
import Register from "./Pages/Register"
import { Toaster } from "sonner"
import Cursor from "./Pages/cursor"
import Dashboard from "./Pages/Dashboard"
import Candidate from "./Pages/Candidate"
import Voter from "./Pages/Voter"
import "@rainbow-me/rainbowkit/styles.css";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "../WalletConfig";
import AdminElectionToggle from "./Pages/AdminElectionToggle"
import ProtectedLayout from "./Protected/ProtectedLayout"
import AuthProvider from "./lib/AuthProvider"


const queryClient = new QueryClient();
const App = () => {
  return (
    <>
    <AuthProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider theme={darkTheme()}>
            <Cursor />
            <Routes >
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<ProtectedLayout/>}>
                <Route index element={<Navigate to="/menu/dashboard" replace />} />
                <Route path="register" element={<Register />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="candidate-list" element={<Candidate />} />
                <Route path="voter-list" element={<Voter />} />
                <Route path="toggle" element={<AdminElectionToggle />} />
              </Route>
            </Routes>
            <Toaster position="top-right" richColors closeButton />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
      </AuthProvider>
    </>
  )
}

export default App