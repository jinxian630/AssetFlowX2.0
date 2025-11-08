"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export type WalletType = "metamask" | "okx" | null;

export interface WalletState {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
  walletType: WalletType;
  chainId: string | null;
}

declare global {
  interface Window {
    ethereum?: any;
    okxwallet?: any;
  }
}

export const useWallet = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    balance: null,
    isConnected: false,
    walletType: null,
    chainId: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          const address = accounts[0].address;
          const balance = await provider.getBalance(address);
          const network = await provider.getNetwork();
          setWalletState({
            address,
            balance: ethers.formatEther(balance),
            isConnected: true,
            walletType: window.okxwallet ? "okx" : "metamask",
            chainId: network.chainId.toString(),
          });
        }
      } catch (err) {
        console.error("Error checking connection:", err);
      }
    }
  };

  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError(null);

    if (typeof window === "undefined" || !window.ethereum) {
      setError("MetaMask is not installed. Please install it to continue.");
      setIsConnecting(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);

      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];

      // Get balance
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      // Check if on Ethereum Mainnet (chainId: 1)
      if (network.chainId !== BigInt(1)) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            setError("Please add Ethereum Mainnet to your MetaMask");
          } else {
            setError("Please switch to Ethereum Mainnet in MetaMask");
          }
          setIsConnecting(false);
          return;
        }
      }

      setWalletState({
        address,
        balance: ethers.formatEther(balance),
        isConnected: true,
        walletType: "metamask",
        chainId: network.chainId.toString(),
      });

      // Listen for account changes
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    } catch (err: any) {
      setError(err.message || "Failed to connect to MetaMask");
      console.error("MetaMask connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const connectOKX = async () => {
    setIsConnecting(true);
    setError(null);

    if (typeof window === "undefined" || !window.okxwallet) {
      setError("OKX Wallet is not installed. Please install it to continue.");
      setIsConnecting(false);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.okxwallet);

      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];

      // Get balance
      const balance = await provider.getBalance(address);
      const network = await provider.getNetwork();

      // Check if on Ethereum Mainnet
      if (network.chainId !== BigInt(1)) {
        try {
          await window.okxwallet.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x1" }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            setError("Please add Ethereum Mainnet to your OKX Wallet");
          } else {
            setError("Please switch to Ethereum Mainnet in OKX Wallet");
          }
          setIsConnecting(false);
          return;
        }
      }

      setWalletState({
        address,
        balance: ethers.formatEther(balance),
        isConnected: true,
        walletType: "okx",
        chainId: network.chainId.toString(),
      });

      // Listen for account changes
      window.okxwallet.on("accountsChanged", handleAccountsChanged);
      window.okxwallet.on("chainChanged", handleChainChanged);
    } catch (err: any) {
      setError(err.message || "Failed to connect to OKX Wallet");
      console.error("OKX connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      checkConnection();
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const disconnect = () => {
    if (window.ethereum) {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    }
    if (window.okxwallet) {
      window.okxwallet.removeListener("accountsChanged", handleAccountsChanged);
      window.okxwallet.removeListener("chainChanged", handleChainChanged);
    }

    setWalletState({
      address: null,
      balance: null,
      isConnected: false,
      walletType: null,
      chainId: null,
    });
    setError(null);
  };

  return {
    ...walletState,
    error,
    isConnecting,
    connectMetaMask,
    connectOKX,
    disconnect,
  };
};
