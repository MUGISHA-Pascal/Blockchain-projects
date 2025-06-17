"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Ticket, Send, Shield, X, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Contract ABI - only the functions we need
const TICKETS_ABI = [
  "function issueTicket(string memory _eventName) public returns (uint256)",
  "function transferTicket(uint256 _ticketId, address _to) public",
  "function verifyTicket(uint256 _ticketId) public view returns (bool)",
  "function invalidateTicket(uint256 _ticketId) public",
  "function tickets(uint256) public view returns (uint256 id, string eventName, address owner, bool isValid)",
  "function nextTicketId() public view returns (uint256)",
  "event TicketIssued(uint256 indexed id, string eventName, address indexed owner)",
  "event TicketTransferred(uint256 indexed id, address indexed from, address indexed to)",
]

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x..." // You'll need to replace this with your actual contract address

interface TicketData {
  id: number
  eventName: string
  owner: string
  isValid: boolean
}

export default function TicketsDApp() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [account, setAccount] = useState<string>("")
  const [isConnected, setIsConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState<TicketData[]>([])

  // Form states
  const [eventName, setEventName] = useState("")
  const [transferTicketId, setTransferTicketId] = useState("")
  const [transferAddress, setTransferAddress] = useState("")
  const [verifyTicketId, setVerifyTicketId] = useState("")
  const [invalidateTicketId, setInvalidateTicketId] = useState("")

  const { toast } = useToast()

  // Connect wallet
  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const accounts = await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const contract = new ethers.Contract(CONTRACT_ADDRESS, TICKETS_ABI, signer)

        setProvider(provider)
        setSigner(signer)
        setContract(contract)
        setAccount(accounts[0])
        setIsConnected(true)

        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })

        await loadTickets(contract, accounts[0])
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to use this application.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Load user's tickets
  const loadTickets = async (contractInstance: ethers.Contract, userAddress: string) => {
    try {
      setLoading(true)
      const nextId = await contractInstance.nextTicketId()
      const userTickets: TicketData[] = []

      for (let i = 0; i < nextId; i++) {
        const ticket = await contractInstance.tickets(i)
        if (ticket.owner.toLowerCase() === userAddress.toLowerCase()) {
          userTickets.push({
            id: i,
            eventName: ticket.eventName,
            owner: ticket.owner,
            isValid: ticket.isValid,
          })
        }
      }

      setTickets(userTickets)
    } catch (error) {
      console.error("Error loading tickets:", error)
      toast({
        title: "Error",
        description: "Failed to load tickets.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Issue new ticket
  const issueTicket = async () => {
    if (!contract || !eventName.trim()) return

    try {
      setLoading(true)
      const tx = await contract.issueTicket(eventName)
      await tx.wait()

      toast({
        title: "Ticket Issued",
        description: `Ticket for "${eventName}" has been issued successfully!`,
      })

      setEventName("")
      await loadTickets(contract, account)
    } catch (error) {
      console.error("Error issuing ticket:", error)
      toast({
        title: "Error",
        description: "Failed to issue ticket. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Transfer ticket
  const transferTicket = async () => {
    if (!contract || !transferTicketId || !transferAddress) return

    try {
      setLoading(true)
      const tx = await contract.transferTicket(Number.parseInt(transferTicketId), transferAddress)
      await tx.wait()

      toast({
        title: "Ticket Transferred",
        description: `Ticket #${transferTicketId} has been transferred successfully!`,
      })

      setTransferTicketId("")
      setTransferAddress("")
      await loadTickets(contract, account)
    } catch (error) {
      console.error("Error transferring ticket:", error)
      toast({
        title: "Error",
        description: "Failed to transfer ticket. Please check ownership and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Verify ticket
  const verifyTicket = async () => {
    if (!contract || !verifyTicketId) return

    try {
      setLoading(true)
      const isValid = await contract.verifyTicket(Number.parseInt(verifyTicketId))

      toast({
        title: "Ticket Verification",
        description: `Ticket #${verifyTicketId} is ${isValid ? "VALID" : "INVALID"}`,
        variant: isValid ? "default" : "destructive",
      })

      setVerifyTicketId("")
    } catch (error) {
      console.error("Error verifying ticket:", error)
      toast({
        title: "Error",
        description: "Failed to verify ticket.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Invalidate ticket
  const invalidateTicket = async () => {
    if (!contract || !invalidateTicketId) return

    try {
      setLoading(true)
      const tx = await contract.invalidateTicket(Number.parseInt(invalidateTicketId))
      await tx.wait()

      toast({
        title: "Ticket Invalidated",
        description: `Ticket #${invalidateTicketId} has been invalidated.`,
      })

      setInvalidateTicketId("")
      await loadTickets(contract, account)
    } catch (error) {
      console.error("Error invalidating ticket:", error)
      toast({
        title: "Error",
        description: "Failed to invalidate ticket. Please check ownership and try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Refresh tickets
  const refreshTickets = async () => {
    if (contract && account) {
      await loadTickets(contract, account)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tickets DApp</h1>
          <p className="text-gray-600">Decentralized ticket management on the blockchain</p>
        </div>

        {!isConnected ? (
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Wallet className="h-6 w-6" />
                Connect Wallet
              </CardTitle>
              <CardDescription>Connect your MetaMask wallet to start managing tickets</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={connectWallet} className="w-full" size="lg">
                Connect MetaMask
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Connected Account
                  </span>
                  <Button variant="outline" size="sm" onClick={refreshTickets} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-mono text-sm bg-gray-100 p-2 rounded">{account}</p>
              </CardContent>
            </Card>

            {/* My Tickets */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  My Tickets ({tickets.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tickets.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No tickets found</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tickets.map((ticket) => (
                      <Card key={ticket.id} className="border-2">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span>#{ticket.id}</span>
                            <Badge variant={ticket.isValid ? "default" : "destructive"}>
                              {ticket.isValid ? "Valid" : "Invalid"}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="font-semibold text-gray-900">{ticket.eventName}</p>
                          <p className="text-sm text-gray-500 font-mono mt-1">
                            {ticket.owner.slice(0, 6)}...{ticket.owner.slice(-4)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contract Interactions */}
            <Tabs defaultValue="issue" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="issue">Issue Ticket</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
                <TabsTrigger value="verify">Verify</TabsTrigger>
                <TabsTrigger value="invalidate">Invalidate</TabsTrigger>
              </TabsList>

              <TabsContent value="issue">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ticket className="h-5 w-5" />
                      Issue New Ticket
                    </CardTitle>
                    <CardDescription>Create a new ticket for an event</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="eventName">Event Name</Label>
                      <Input
                        id="eventName"
                        placeholder="Enter event name"
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                      />
                    </div>
                    <Button onClick={issueTicket} disabled={loading || !eventName.trim()} className="w-full">
                      {loading ? "Issuing..." : "Issue Ticket"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="transfer">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Send className="h-5 w-5" />
                      Transfer Ticket
                    </CardTitle>
                    <CardDescription>Transfer a ticket to another address</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="transferTicketId">Ticket ID</Label>
                      <Input
                        id="transferTicketId"
                        type="number"
                        placeholder="Enter ticket ID"
                        value={transferTicketId}
                        onChange={(e) => setTransferTicketId(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="transferAddress">Recipient Address</Label>
                      <Input
                        id="transferAddress"
                        placeholder="0x..."
                        value={transferAddress}
                        onChange={(e) => setTransferAddress(e.target.value)}
                      />
                    </div>
                    <Button
                      onClick={transferTicket}
                      disabled={loading || !transferTicketId || !transferAddress}
                      className="w-full"
                    >
                      {loading ? "Transferring..." : "Transfer Ticket"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verify">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Verify Ticket
                    </CardTitle>
                    <CardDescription>Check if a ticket is valid</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="verifyTicketId">Ticket ID</Label>
                      <Input
                        id="verifyTicketId"
                        type="number"
                        placeholder="Enter ticket ID"
                        value={verifyTicketId}
                        onChange={(e) => setVerifyTicketId(e.target.value)}
                      />
                    </div>
                    <Button onClick={verifyTicket} disabled={loading || !verifyTicketId} className="w-full">
                      {loading ? "Verifying..." : "Verify Ticket"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="invalidate">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <X className="h-5 w-5" />
                      Invalidate Ticket
                    </CardTitle>
                    <CardDescription>Mark a ticket as invalid (only owner can do this)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="invalidateTicketId">Ticket ID</Label>
                      <Input
                        id="invalidateTicketId"
                        type="number"
                        placeholder="Enter ticket ID"
                        value={invalidateTicketId}
                        onChange={(e) => setInvalidateTicketId(e.target.value)}
                      />
                    </div>
                    <Alert>
                      <AlertDescription>
                        Warning: This action cannot be undone. Only the ticket owner can invalidate a ticket.
                      </AlertDescription>
                    </Alert>
                    <Button
                      onClick={invalidateTicket}
                      disabled={loading || !invalidateTicketId}
                      variant="destructive"
                      className="w-full"
                    >
                      {loading ? "Invalidating..." : "Invalidate Ticket"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  )
}
