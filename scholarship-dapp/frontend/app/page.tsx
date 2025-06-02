"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Wallet, DollarSign, GraduationCap, Shield, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Contract ABI
const SCHOLARSHIP_ABI = [
  "function admin() view returns (address)",
  "function applicants(address) view returns (bool)",
  "function totalDonations() view returns (uint256)",
  "function donate() payable",
  "function applyForScholarship()",
  "function releaseFunds(address payable recipient, uint256 amount)",
  "function getBalance() view returns (uint256)",
  "event Donated(address indexed donor, uint256 amount)",
  "event Applied(address indexed applicant)",
  "event FundsReleased(address indexed recipient, uint256 amount)",
]

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x..." // You'll need to replace this with your actual contract address

export default function ScholarshipDApp() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string>("")
  const [isAdmin, setIsAdmin] = useState<boolean>(false)
  const [hasApplied, setHasApplied] = useState<boolean>(false)
  const [contractBalance, setContractBalance] = useState<string>("0")
  const [totalDonations, setTotalDonations] = useState<string>("0")
  const [loading, setLoading] = useState<boolean>(false)

  // Form states
  const [donationAmount, setDonationAmount] = useState<string>("")
  const [releaseAmount, setReleaseAmount] = useState<string>("")
  const [recipientAddress, setRecipientAddress] = useState<string>("")

  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      initializeProvider()
    }
  }, [])

  useEffect(() => {
    if (contract && account) {
      loadContractData()
    }
  }, [contract, account])

  const initializeProvider = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)
    } catch (error) {
      console.error("Failed to initialize provider:", error)
    }
  }

  const connectWallet = async () => {
    if (!provider) {
      toast({
        title: "Error",
        description: "Please install MetaMask to use this application",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      await provider.send("eth_requestAccounts", [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setSigner(signer)
      setAccount(address)

      const contract = new ethers.Contract(CONTRACT_ADDRESS, SCHOLARSHIP_ABI, signer)
      setContract(contract)

      toast({
        title: "Success",
        description: "Wallet connected successfully",
      })
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      toast({
        title: "Error",
        description: "Failed to connect wallet",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadContractData = async () => {
    if (!contract || !account) return

    try {
      const [admin, balance, donations, applied] = await Promise.all([
        contract.admin(),
        contract.getBalance(),
        contract.totalDonations(),
        contract.applicants(account),
      ])

      setIsAdmin(admin.toLowerCase() === account.toLowerCase())
      setContractBalance(ethers.formatEther(balance))
      setTotalDonations(ethers.formatEther(donations))
      setHasApplied(applied)
    } catch (error) {
      console.error("Failed to load contract data:", error)
    }
  }

  const handleDonate = async () => {
    if (!contract || !donationAmount) return

    try {
      setLoading(true)
      const tx = await contract.donate({
        value: ethers.parseEther(donationAmount),
      })

      toast({
        title: "Transaction Submitted",
        description: "Your donation is being processed...",
      })

      await tx.wait()

      toast({
        title: "Success",
        description: `Successfully donated ${donationAmount} ETH!`,
      })

      setDonationAmount("")
      await loadContractData()
    } catch (error) {
      console.error("Donation failed:", error)
      toast({
        title: "Error",
        description: "Failed to process donation",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!contract) return

    try {
      setLoading(true)
      const tx = await contract.applyForScholarship()

      toast({
        title: "Transaction Submitted",
        description: "Your application is being processed...",
      })

      await tx.wait()

      toast({
        title: "Success",
        description: "Successfully applied for scholarship!",
      })

      await loadContractData()
    } catch (error) {
      console.error("Application failed:", error)
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReleaseFunds = async () => {
    if (!contract || !releaseAmount || !recipientAddress) return

    try {
      setLoading(true)
      const tx = await contract.releaseFunds(recipientAddress, ethers.parseEther(releaseAmount))

      toast({
        title: "Transaction Submitted",
        description: "Fund release is being processed...",
      })

      await tx.wait()

      toast({
        title: "Success",
        description: `Successfully released ${releaseAmount} ETH to ${recipientAddress}`,
      })

      setReleaseAmount("")
      setRecipientAddress("")
      await loadContractData()
    } catch (error) {
      console.error("Fund release failed:", error)
      toast({
        title: "Error",
        description: "Failed to release funds",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Scholarship DApp</CardTitle>
            <CardDescription>Connect your wallet to interact with the scholarship contract</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={connectWallet} disabled={loading} className="w-full" size="lg">
              <Wallet className="w-4 h-4 mr-2" />
              {loading ? "Connecting..." : "Connect Wallet"}
            </Button>

            {!provider && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>Please install MetaMask to use this application</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Scholarship DApp</h1>
                <p className="text-sm text-gray-600">Decentralized scholarship management</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Shield className="w-3 h-3 mr-1" />
                  Admin
                </Badge>
              )}
              <Badge variant="outline">
                {account.slice(0, 6)}...{account.slice(-4)}
              </Badge>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contract Balance</p>
                    <p className="text-xl font-semibold">{contractBalance} ETH</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Donations</p>
                    <p className="text-xl font-semibold">{totalDonations} ETH</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="donate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="donate">Donate</TabsTrigger>
            <TabsTrigger value="apply">Apply</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>

          <TabsContent value="donate">
            <Card>
              <CardHeader>
                <CardTitle>Make a Donation</CardTitle>
                <CardDescription>Support students by donating to the scholarship fund</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="donation">Amount (ETH)</Label>
                  <Input
                    id="donation"
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                  />
                </div>
                <Button onClick={handleDonate} disabled={loading || !donationAmount} className="w-full">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {loading ? "Processing..." : "Donate"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apply">
            <Card>
              <CardHeader>
                <CardTitle>Apply for Scholarship</CardTitle>
                <CardDescription>Submit your application to be considered for scholarship funding</CardDescription>
              </CardHeader>
              <CardContent>
                {hasApplied ? (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      You have already applied for this scholarship. Your application is under review.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Button onClick={handleApply} disabled={loading} className="w-full">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    {loading ? "Processing..." : "Apply for Scholarship"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Panel</CardTitle>
                  <CardDescription>Release funds to scholarship recipients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      placeholder="0x..."
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (ETH)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.001"
                      placeholder="0.1"
                      value={releaseAmount}
                      onChange={(e) => setReleaseAmount(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={handleReleaseFunds}
                    disabled={loading || !releaseAmount || !recipientAddress}
                    className="w-full"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {loading ? "Processing..." : "Release Funds"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
