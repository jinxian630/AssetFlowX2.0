"use client";

import { motion } from "framer-motion";
import { Wallet, AlertCircle } from "lucide-react";
import { useWallet } from "@/lib/useWallet";
import ConnectionSuccessModal from "./connection-success-modal";

export default function Hero() {
  const {
    isConnecting,
    isConnected,
    address,
    walletType,
    error,
    connectMetaMask,
    connectOKX,
  } = useWallet();

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[#020617] overflow-hidden">

      {/* Cyberpunk Glow Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/grid-noise.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-40 left-1/3 w-[600px] h-[600px] bg-[#9A4DFF] blur-[200px] opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#00E5FF] blur-[200px] opacity-40"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        className="relative z-20 max-w-3xl text-center px-6"
      >
        {/* Title */}
        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight drop-shadow-[0_0_20px_#9A4DFF]">
          AssetFlowX
        </h1>
        <p className="mt-2 text-xl text-purple-300 tracking-wide">
          The Web3 Settlement Layer for Education Businesses
        </p>

        {/* Core tagline */}
        <p className="mt-6 text-lg sm:text-xl text-blue-200 leading-relaxed">
          <span className="text-[#00E5FF] font-semibold">
            Secure cross-organization payments,
          </span>
          <br />
          <span className="text-[#9A4DFF] font-semibold">
            transparent revenue sharing,
          </span>
          <br />
          <span className="text-[#FF2D95] font-semibold">
            and AI-powered auditing on Huawei Cloud.
          </span>
        </p>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-3 text-red-400"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 0 20px #00E5FF" }}
            whileTap={{ scale: 0.98 }}
            onClick={connectMetaMask}
            disabled={isConnecting}
            className="px-6 py-3 rounded-xl bg-[#00E5FF] text-black font-bold shadow-[0_0_10px_#00E5FF] hover:shadow-[0_0_20px_#00E5FF] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            {isConnecting ? "Connecting..." : "Connect MetaMask"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.06, boxShadow: "0 0 20px #9A4DFF" }}
            whileTap={{ scale: 0.98 }}
            onClick={connectOKX}
            disabled={isConnecting}
            className="px-6 py-3 rounded-xl bg-transparent border border-[#9A4DFF] text-[#9A4DFF] font-bold hover:text-white hover:bg-[#9A4DFF] shadow-[0_0_10px_#9A4DFF] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            {isConnecting ? "Connecting..." : "Connect OKX Wallet"}
          </motion.button>
        </div>

        {/* Wallet Info */}
        <div className="mt-8 text-sm text-gray-400">
          <p>Connect your wallet to access the AssetFlowX dashboard</p>
          <p className="mt-2">Ethereum Mainnet required</p>
        </div>
      </motion.div>

      {/* Success Modal */}
      <ConnectionSuccessModal
        isOpen={isConnected}
        walletAddress={address || ""}
        walletType={walletType}
      />
    </section>
  );
}
