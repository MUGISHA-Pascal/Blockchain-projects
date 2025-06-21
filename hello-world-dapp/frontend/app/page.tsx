"use client";

import { useState, useEffect } from "react";
import Web3 from "web3";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Wallet } from "lucide-react";

// Contract ABI
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getMyName",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "_name", type: "string" }],
    name: "setName",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x53B57865956abaCa2BA66136d68E1c80b998275D";

export default function Component() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string>("");
  const [contract, setContract] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form states
  const [newName, setNewName] = useState("");
  const [displayedName, setDisplayedName] = useState("");

  const connectWallet = async () => {
    try {
      setLoading(true);
      setError("");
      if (typeof window.ethereum !== "undefined") {
        const web3Instance = new Web3(window.ethereum);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setIsConnected(true);
          const contractInstance = new web3Instance.eth.Contract(
            CONTRACT_ABI,
            CONTRACT_ADDRESS
          );
          setContract(contractInstance);
          setSuccess("Wallet connected successfully!");
        }
      } else {
        setError("MetaMask is not installed.");
      }
    } catch (err: any) {
      setError(`Failed to connect wallet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSetName = async () => {
    if (!contract || !account || !newName.trim()) {
      setError("Please enter a valid name");
      return;
    }
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      await contract.methods.setName(newName.trim()).send({
        from: account,
        gas: 100000,
      });
      setSuccess("Name set successfully!");
      setNewName("");
    } catch (err: any) {
      setError(`Failed to set name: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetName = async () => {
    if (!contract || !account) {
      setError("Contract not initialized");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const name = await contract.methods.getMyName().call({ from: account });
      setDisplayedName(name || "No name set");
      setSuccess("Name retrieved successfully!");
    } catch (err: any) {
      setError(`Failed to get name: ${err.message}`);
      setDisplayedName("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount("");
          setContract(null);
          setDisplayedName("");
        } else {
          setAccount(accounts[0]);
        }
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4">
      <div className="w-full max-w-2xl space-y-6">
        {!isConnected ? (
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold text-white">Name Storage DApp</h1>
            <Card className="bg-gray-800 border border-gray-700 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-white">
                  <Wallet className="h-5 w-5" />
                  Connect Wallet
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Connect your MetaMask wallet to interact with the smart
                  contract
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={connectWallet}
                  disabled={loading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect MetaMask"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-extrabold text-white">
              Hello World and Name DApp
            </h1>
            <Card className="bg-gray-800 border border-gray-700 shadow-lg">
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="name-input"
                    className="text-lg font-medium text-white"
                  >
                    Enter your name:
                  </Label>
                  <Input
                    id="name-input"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Your name"
                    disabled={loading}
                    className="text-lg p-4 bg-gray-900 text-white border border-gray-600"
                  />
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={handleSetName}
                    disabled={loading || !newName.trim()}
                    size="lg"
                    className="px-8 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Setting...
                      </>
                    ) : (
                      "Set Name"
                    )}
                  </Button>

                  <Button
                    onClick={handleGetName}
                    disabled={loading}
                    variant="outline"
                    size="lg"
                    className="px-8 border border-gray-500 text-gray-700 hover:bg-gray-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Getting...
                      </>
                    ) : (
                      "Get Name"
                    )}
                  </Button>
                </div>

                {displayedName && (
                  <div className="mt-6 p-4 bg-gray-700 border border-gray-600 rounded-lg">
                    <Label className="text-lg font-medium text-white">
                      Your Name:
                    </Label>
                    <p className="text-xl text-green-400 font-semibold mt-2">
                      {displayedName}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {error && (
          <Alert
            variant="destructive"
            className="bg-red-900 border border-red-700 text-white"
          >
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-900 border border-green-700 text-white">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
