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
import { Loader2, Wallet, User, Search } from "lucide-react";

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
const CONTRACT_ADDRESS = "0x53B57865956abaCa2BA66136d68E1c80b998275D"; // You'll need to replace this with your actual contract address

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
  const [myName, setMyName] = useState("");
  const [lookupAddress, setLookupAddress] = useState("");
  const [lookedUpName, setLookedUpName] = useState("");

  // Initialize Web3 and connect wallet
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError("");

      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        const web3Instance = new Web3(window.ethereum);

        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          setWeb3(web3Instance);
          setAccount(accounts[0]);
          setIsConnected(true);

          // Initialize contract
          const contractInstance = new web3Instance.eth.Contract(
            CONTRACT_ABI,
            CONTRACT_ADDRESS
          );
          setContract(contractInstance);

          setSuccess("Wallet connected successfully!");

          // Load user's current name
          await loadMyName(contractInstance, accounts[0]);
        }
      } else {
        setError(
          "MetaMask is not installed. Please install MetaMask to use this app."
        );
      }
    } catch (err: any) {
      setError(`Failed to connect wallet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Load current user's name
  const loadMyName = async (contractInstance?: any, userAccount?: string) => {
    try {
      const contractToUse = contractInstance || contract;
      const accountToUse = userAccount || account;

      if (contractToUse && accountToUse) {
        const name = await contractToUse.methods
          .getMyName()
          .call({ from: accountToUse });
        setMyName(name || "No name set");
      }
    } catch (err: any) {
      console.error("Error loading name:", err);
    }
  };

  // Set name function
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
        gas: 100000, // Adjust gas limit as needed
      });

      setSuccess("Name set successfully!");
      setNewName("");

      // Reload current name
      await loadMyName();
    } catch (err: any) {
      setError(`Failed to set name: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Lookup name by address
  const handleLookupName = async () => {
    if (!contract || !lookupAddress.trim()) {
      setError("Please enter a valid address");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const name = await contract.methods.getName(lookupAddress.trim()).call();
      setLookedUpName(name || "No name found for this address");
    } catch (err: any) {
      setError(`Failed to lookup name: ${err.message}`);
      setLookedUpName("");
    } finally {
      setLoading(false);
    }
  };

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          setIsConnected(false);
          setAccount("");
          setContract(null);
          setMyName("");
        } else {
          setAccount(accounts[0]);
          if (contract) {
            loadMyName();
          }
        }
      });
    }
  }, [contract]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">
            Name Storage DApp
          </h1>
          <p className="text-gray-600">
            Store and retrieve names on the blockchain
          </p>
        </div>

        {/* Wallet Connection */}
        {!isConnected ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Wallet className="h-5 w-5" />
                Connect Wallet
              </CardTitle>
              <CardDescription>
                Connect your MetaMask wallet to interact with the smart contract
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={connectWallet}
                disabled={loading}
                className="w-full"
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
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Account Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <Label className="text-sm font-medium">
                    Connected Account:
                  </Label>
                  <p className="text-sm text-gray-600 font-mono break-all">
                    {account}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    Your Current Name:
                  </Label>
                  <p className="text-sm text-gray-600">{myName}</p>
                </div>
              </CardContent>
            </Card>

            {/* Set Name */}
            <Card>
              <CardHeader>
                <CardTitle>Set Your Name</CardTitle>
                <CardDescription>
                  Store your name on the blockchain
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-name">Enter your name</Label>
                  <Input
                    id="new-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Your name"
                    disabled={loading}
                  />
                </div>
                <Button
                  onClick={handleSetName}
                  disabled={loading || !newName.trim()}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting Name...
                    </>
                  ) : (
                    "Set Name"
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Lookup Name */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Lookup Name by Address
                </CardTitle>
                <CardDescription>
                  Find the name associated with any Ethereum address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={lookupAddress}
                    onChange={(e) => setLookupAddress(e.target.value)}
                    placeholder="0x... (Ethereum address)"
                    disabled={loading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleLookupName}
                    disabled={loading || !lookupAddress.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Lookup"
                    )}
                  </Button>
                </div>
                {lookedUpName && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Result:</Label>
                    <p className="text-sm text-gray-700">{lookedUpName}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>
              1. Make sure you have MetaMask installed and connected to the
              correct network
            </p>
            <p>
              2. Update the CONTRACT_ADDRESS in the code with your deployed
              contract address
            </p>
            <p>
              3. Connect your wallet to start interacting with the smart
              contract
            </p>
            <p>4. Set your name to store it on the blockchain</p>
            <p>5. Look up names associated with any Ethereum address</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
