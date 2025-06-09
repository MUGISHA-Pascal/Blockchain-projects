"use client"

import { useState } from "react"
import Web3 from "web3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Vote, Users, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Contract ABI - only the functions we need
const CONTRACT_ABI = [
  {
    inputs: [],
    name: "candidatesCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "candidates",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "uint256", name: "voteCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "voters",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_candidateId", type: "uint256" }],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [{ indexed: true, internalType: "uint256", name: "candidateId", type: "uint256" }],
    name: "votedEvent",
    type: "event",
  },
] as const

interface Candidate {
  id: number
  name: string
  voteCount: number
}

export default function VotingApp() {
  const [web3, setWeb3] = useState<Web3 | null>(null)
  const [account, setAccount] = useState<string>("")
  const [contract, setContract] = useState<any>(null)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [hasVoted, setHasVoted] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [contractAddress, setContractAddress] = useState<string>("")
  const { toast } = useToast()

  // Initialize Web3 and connect to wallet
  const connectWallet = async () => {
    try {
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const web3Instance = new Web3((window as any).ethereum)
        await (window as any).ethereum.request({ method: "eth_requestAccounts" })

        const accounts = await web3Instance.eth.getAccounts()
        setWeb3(web3Instance)
        setAccount(accounts[0])

        toast({
          title: "Wallet Connected",
          description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
        })
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to use this application",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect to wallet",
        variant: "destructive",
      })
    }
  }

  // Initialize contract
  const initializeContract = async (address: string) => {
    if (!web3 || !address) return

    try {
      const contractInstance = new web3.eth.Contract(CONTRACT_ABI, address)
      setContract(contractInstance)

      // Load candidates
      await loadCandidates(contractInstance)

      // Check if user has voted
      if (account) {
        const voted = await contractInstance.methods.voters(account).call()
        setHasVoted(voted)
      }

      // Listen for vote events
      contractInstance.events
        .votedEvent({})
        .on("data", (event: any) => {
          toast({
            title: "Vote Cast!",
            description: `Someone voted for candidate ${event.returnValues.candidateId}`,
          })
          loadCandidates(contractInstance)
        })
        .on("error", console.error)
    } catch (error) {
      console.error("Error initializing contract:", error)
      toast({
        title: "Contract Error",
        description: "Failed to initialize contract. Please check the address.",
        variant: "destructive",
      })
    }
  }

  // Load candidates from contract
  const loadCandidates = async (contractInstance: any) => {
    try {
      const candidatesCount = await contractInstance.methods.candidatesCount().call()
      const candidatesList: Candidate[] = []

      for (let i = 1; i <= candidatesCount; i++) {
        const candidate = await contractInstance.methods.candidates(i).call()
        candidatesList.push({
          id: Number(candidate.id),
          name: candidate.name,
          voteCount: Number(candidate.voteCount),
        })
      }

      setCandidates(candidatesList)
    } catch (error) {
      console.error("Error loading candidates:", error)
    }
  }

  // Vote for a candidate
  const vote = async (candidateId: number) => {
    if (!contract || !account) return

    setLoading(true)
    try {
      await contract.methods.vote(candidateId).send({ from: account })
      setHasVoted(true)
      toast({
        title: "Vote Successful!",
        description: `You voted for ${candidates.find((c) => c.id === candidateId)?.name}`,
      })
    } catch (error: any) {
      console.error("Error voting:", error)
      let errorMessage = "Failed to cast vote"

      if (error.message.includes("Already voted")) {
        errorMessage = "You have already voted"
      } else if (error.message.includes("Invalid candidate")) {
        errorMessage = "Invalid candidate selected"
      }

      toast({
        title: "Vote Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Calculate total votes
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Decentralized Voting</h1>
          <p className="text-gray-600">Cast your vote on the blockchain</p>
        </div>

        {/* Wallet Connection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!account ? (
              <Button onClick={connectWallet} className="w-full">
                Connect Wallet
              </Button>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Connected Account:</p>
                  <p className="font-mono text-sm">{account}</p>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Connected
                </Badge>
              </div>
            )}

            {account && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Contract Address:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter contract address (0x...)"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <Button onClick={() => initializeContract(contractAddress)} disabled={!contractAddress}>
                    Connect
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Voting Status */}
        {contract && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {hasVoted
                ? "You have already cast your vote. Thank you for participating!"
                : "You can vote for one candidate. Choose wisely!"}
            </AlertDescription>
          </Alert>
        )}

        {/* Voting Stats */}
        {candidates.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Voting Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{candidates.length}</div>
                  <div className="text-sm text-gray-600">Candidates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{totalVotes}</div>
                  <div className="text-sm text-gray-600">Total Votes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {candidates.length > 0 ? Math.max(...candidates.map((c) => c.voteCount)) : 0}
                  </div>
                  <div className="text-sm text-gray-600">Highest Votes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Candidates */}
        {candidates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {candidates.map((candidate) => {
              const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0
              const isLeading =
                candidate.voteCount === Math.max(...candidates.map((c) => c.voteCount)) && candidate.voteCount > 0

              return (
                <Card key={candidate.id} className={`relative ${isLeading ? "ring-2 ring-yellow-400" : ""}`}>
                  {isLeading && <Badge className="absolute -top-2 left-4 bg-yellow-400 text-yellow-900">Leading</Badge>}
                  <CardHeader>
                    <CardTitle className="text-xl">{candidate.name}</CardTitle>
                    <CardDescription>Candidate #{candidate.id}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Votes: {candidate.voteCount}</span>
                        <span>{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => vote(candidate.id)}
                      disabled={!account || hasVoted || loading}
                      className="w-full"
                      variant={hasVoted ? "outline" : "default"}
                    >
                      <Vote className="h-4 w-4 mr-2" />
                      {hasVoted ? "Already Voted" : loading ? "Voting..." : "Vote"}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Instructions */}
        {!contract && account && (
          <Card>
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>Follow these steps to start voting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline">1</Badge>
                <span>Deploy the voting contract to your network</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">2</Badge>
                <span>Copy the contract address</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">3</Badge>
                <span>Paste it above and click "Connect"</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">4</Badge>
                <span>Vote for your preferred candidate</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
