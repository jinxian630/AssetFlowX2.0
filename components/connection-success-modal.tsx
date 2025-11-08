"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

interface ConnectionSuccessModalProps {
  isOpen: boolean;
  walletAddress: string;
  walletType: "metamask" | "okx" | null;
}

export default function ConnectionSuccessModal({
  isOpen,
  walletAddress,
  walletType,
}: ConnectionSuccessModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const walletName = walletType === "metamask" ? "MetaMask" : "OKX Wallet";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateX: 90 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring",
                duration: 0.6,
                bounce: 0.4,
              }}
              className="relative max-w-md w-full"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#9A4DFF] blur-[100px] opacity-50 animate-pulse"></div>

              {/* Card */}
              <div className="relative bg-gradient-to-br from-[#0F172A] to-[#1E293B] border-2 border-[#9A4DFF] rounded-3xl p-8 shadow-[0_0_50px_rgba(154,77,255,0.5)]">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.2,
                    type: "spring",
                    duration: 0.5,
                    bounce: 0.6,
                  }}
                  className="flex justify-center mb-6"
                >
                  <div className="relative">
                    {/* Rotating ring */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#00E5FF] border-r-[#9A4DFF]"
                    ></motion.div>

                    {/* Success check */}
                    <div className="relative p-6 rounded-full bg-gradient-to-br from-[#9A4DFF] to-[#00E5FF]">
                      <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>

                    {/* Sparkles */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="absolute -top-2 -right-2"
                    >
                      <Sparkles className="w-6 h-6 text-[#00E5FF]" />
                    </motion.div>
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                      className="absolute -bottom-2 -left-2"
                    >
                      <Sparkles className="w-6 h-6 text-[#9A4DFF]" />
                    </motion.div>
                  </div>
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center space-y-3"
                >
                  <h2 className="text-3xl font-bold text-white drop-shadow-[0_0_10px_#9A4DFF]">
                    Connection Successful!
                  </h2>
                  <p className="text-[#00E5FF] text-lg">
                    Welcome to AssetFlowX
                  </p>
                  <div className="pt-2">
                    <p className="text-sm text-gray-400 mb-1">
                      Connected with {walletName}
                    </p>
                    <code className="text-[#9A4DFF] font-mono text-sm bg-[#020617]/50 px-3 py-1 rounded-lg border border-[#9A4DFF]/30">
                      {formatAddress(walletAddress)}
                    </code>
                  </div>
                </motion.div>

                {/* Progress Bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Logging in...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-[#020617] rounded-full overflow-hidden border border-[#9A4DFF]/30">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-gradient-to-r from-[#9A4DFF] via-[#00E5FF] to-[#9A4DFF] shadow-[0_0_10px_#9A4DFF]"
                    ></motion.div>
                  </div>
                </motion.div>

                {/* Particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, x: 0, y: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 200],
                      y: [0, (Math.random() - 0.5) * 200],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: 0.8 + i * 0.1,
                      ease: "easeOut",
                    }}
                    className="absolute w-2 h-2 rounded-full bg-[#00E5FF]"
                    style={{
                      left: "50%",
                      top: "50%",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
