import { useCallback, useEffect, useState } from 'react'

import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import { Footer } from '../views/Footer'
import { HeaderStat } from '../views/HeaderStat'

import Head from 'next/head'
import { Logo } from '../views/Logo'

import {
  Container, 
  SimpleGrid, 
  ButtonGroup, 
  Flex, 
  HStack,
  Button,
  Divider,
  Heading,
  InputGroup,
  InputRightElement,
  Input,
  Stack,
  Text,
  Box,
  Stat,
  StatLabel,
  useBreakpointValue,
  useColorModeValue,
  Skeleton,
  useToast,
  Image,
  Center
} from '@chakra-ui/react'

import { FaFeather, FaExternalLinkAlt, FaBolt, FaAngleDoubleDown, FaAngleDoubleUp, FaCoins } from 'react-icons/fa'

import { SPORE, CONDOR, POWER, NFT, NFTSALE, POWERSALE, STAKING } from "../helpers/contracts"
import { PROVIDER_OPTIONS, BSC_MAINNET_PROVIDER, NFT_KEY } from "../helpers/constants"

let web3Modal

if (typeof window !== 'undefined') {
    web3Modal = new Web3Modal({
        cacheProvider: true,
        PROVIDER_OPTIONS,
    })
}

const provider = new ethers.providers.JsonRpcProvider(BSC_MAINNET_PROVIDER)
const signer = provider.getSigner()

export default function Home() {

  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  })

  const toast = useToast()
  
  const [injectedProvider, setInjectedProvider] = useState(provider)
  const [injectedSigner, setInjectedSigner] = useState(signer)
  const [address, setAddress] = useState()

  const [totalStakedAmount, setTotalStakedAmount] = useState()
  const [priceCondorNFT, setPriceCondorNFT] = useState()


  //user balances
  const [userStakedBalance, setUserStakedBalance] = useState()
  const [userPendingRewards, setUserPendingRewards] = useState()
  const [userAvailableStaking, setUserAvailableStaking] = useState()
  const [userNFTBalance, setUserNFTBalance] = useState()
  const [userSporeBalance, setUserSporeBalance] = useState()
  const [userCondorBalance, setUserCondorBalance] = useState()
  const [userPowerBalance, setUserPowerBalance] = useState()
  const [userBnbBalance, setUserBnbBalance] = useState()

  const [userAllowancePurchasePower, setUserAllowancePurchasePower] = useState()
  const [userAllowancePurchaseNFT, setUserAllowancePurchaseNFT] = useState()
  const [userAllowanceStakeNFT, setUserAllowanceStakeNFT] = useState()

  //contracts
  const [sporeContract, setSporeContract] = useState()
  const [condorContract, setCondorContract] = useState()
  const [powerContract, setPowerContract] = useState()
  const [stakingContract, setStakingContract] = useState()
  const [nftContract, setNftContract] = useState()
  const [nftSaleContract, setNftSaleContract] = useState()
  const [powerSaleContract, setPowerSaleContract] = useState()

  const updateUserBalances = async (address) => {
    const balanceBnb = await injectedProvider.getBalance(address)
    const balanceSpore = await sporeContract.balanceOf(address)
    const balanceCondor = await condorContract.balanceOf(address)
    const balancePower = await powerContract.balanceOf(address)
    const stakedTokens = await stakingContract.totalStakedFor(address)
    const pendingRewards = await stakingContract.takeWithAddress(address)
    const availableStaking = await stakingContract.getUserAvailableStaking(address)
    const nft = await nftContract.balanceOf(address, NFT_KEY)

    const allowancePurchasePower = await sporeContract.allowance(address, POWERSALE.address)
    const allowancePurchaseNFT = await sporeContract.allowance(address, NFTSALE.address)
    const allowanceStakedNFT = await nftContract.isApprovedForAll(address, STAKING.address)

    setUserBnbBalance(balanceBnb)
    setUserSporeBalance(balanceSpore)
    setUserCondorBalance(balanceCondor)
    setUserPowerBalance(balancePower)
    setUserStakedBalance(stakedTokens)
    setUserPendingRewards(formatNumber6Dec(pendingRewards))
    setUserNFTBalance(nft)

    setUserAllowancePurchasePower(allowancePurchasePower)
    setUserAllowancePurchaseNFT(allowancePurchaseNFT)
    setUserAllowanceStakeNFT(allowanceStakedNFT)
    setUserAvailableStaking(availableStaking)

    /*console.log("address mainnet bnb balance", ethers.utils.formatEther(balanceBnb))
    console.log("address mainnet spore balance", ethers.utils.formatEther(balanceSpore))
    console.log("address mainnet condor balance", ethers.utils.formatEther(balanceCondor))
    console.log("address mainnet power balance", ethers.utils.formatEther(balancePower))
    console.log("address mainnet staked balance", parseInt(stakedTokens))
    console.log("address mainnet pending rewards", formatNumber6Dec(pendingRewards))
    console.log("address mainnet nft balance", parseInt(nft))

    console.log("address mainnet power sale allowance", ethers.utils.formatEther(allowancePurchasePower))
    console.log("address mainnet nft sale allowance", ethers.utils.formatEther(allowancePurchaseNFT))
    console.log("address mainnet nft staking allowance", allowanceStakedNFT)
    console.log("address mainnet nft staking available", parseInt(availableStaking))*/
  }

  const loadContracts = async () => {
    const sporeTokenContract = new ethers.Contract(SPORE.address, SPORE.abi, injectedProvider)
    const condorTokenContract = new ethers.Contract(CONDOR.address, CONDOR.abi, injectedProvider)
    const powerTokenContract = new ethers.Contract(POWER.address, POWER.abi, injectedProvider)
    const stakingContract = new ethers.Contract(STAKING.address, STAKING.abi, injectedProvider)
    const nftContract = new ethers.Contract(NFT.address, NFT.abi, injectedProvider)
    const nftSaleContract = new ethers.Contract(NFTSALE.address, NFTSALE.abi, injectedProvider)
    const powerSaleContract = new ethers.Contract(POWERSALE.address, POWERSALE.abi, injectedProvider)

    setSporeContract(sporeTokenContract)
    setCondorContract(condorTokenContract)
    setPowerContract(powerTokenContract)
    setStakingContract(stakingContract)
    setNftContract(nftContract)
    setNftSaleContract(nftSaleContract)
    setPowerSaleContract(powerSaleContract)
  }

  const loadDefaultValues = async () => {
    const priceNFT = await nftSaleContract._NFTPrices(NFT_KEY)
    const stakedTokens = await stakingContract.totalStaked()
    
    setPriceCondorNFT(BigInt(priceNFT).toString())
    setTotalStakedAmount(BigInt(stakedTokens).toString())
  }

  const formatNumber = (number) => {
    const amount = ethers.utils.formatEther(number)
    const calcDec = Math.pow(10, 0);

    return Math.trunc(amount * calcDec) / calcDec;
  }

  const formatNumber6Dec = (number) => {
    const amount = ethers.utils.formatEther(number)
    const calcDec = Math.pow(10, 6);

    return Math.trunc(amount * calcDec) / calcDec;
  }

  const getCondorNFT = async () => {

    if(!address || !userSporeBalance || !priceCondorNFT) {
      toast({
        title: 'Connect Wallet',
        description: "Please connect your wallet and wait for the page to load.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    const input = document.querySelector('#inputGetCondorNFT')

    if(!Number.isInteger(parseInt(input.value)) || parseInt(input.value) == 0 || input.value.length == 0) {
      toast({
        title: 'Only Numbers',
        description: "Please use only round numbers with no decimal places.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    const inputValue = input.value*formatNumber(priceCondorNFT)
    const formattedValue = parseInt(ethers.utils.parseEther(inputValue.toString()))
    
    if(formatNumber(userSporeBalance) < inputValue) {
      toast({
        title: 'Not Enough Funds',
        description: "Please make sure you have enough funds to proceed.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    if(parseInt(userAllowancePurchaseNFT) < formattedValue) {
      toast({
        title: 'Approve Transaction',
        description: "Please approve the sale contract to spend your Spore.",
        status: 'info',
        duration: 6000,
        isClosable: true,
      })
      
      const sporeContractSigner = sporeContract.connect(injectedSigner);
      const approveTX = await sporeContractSigner.approve(NFTSALE.address, formattedValue.toString())
      
      toast({
        title: 'Approving Transaction',
        description: "Please wait until the transaction is approved.",
        status: 'info',
        duration: 6000,
        isClosable: true,
      })

      await approveTX.wait()

      if(approveTX) {
        toast({
          title: 'Approve Success!',
          description: "You have successfully approved the request.",
          status: 'success',
          duration: 6000,
          isClosable: true,
        })
        setUserAllowancePurchaseNFT(formattedValue)
      }
    }

    toast({
      title: 'Confirm Transaction',
      description: "Please confirm the transaction in your wallet to proceed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    const nftSaleContractSigner = nftSaleContract.connect(injectedSigner)
    const approvePurchaseTX = await nftSaleContractSigner.purchase(address, NFT_KEY, input.value, "0x0000")
    
    toast({
      title: 'Confirming Transaction',
      description: "Please wait until the transaction is confirmed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    await approvePurchaseTX.wait()
    
    if(!approvePurchaseTX) {
      toast({
        title: 'Transaction Failed',
        description: "Please refresh the page and try again.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }

    toast({
      title: 'Transaction Success!',
      description: "You have successfully purchased the nfts.",
      status: 'success',
      duration: 6000,
      isClosable: true,
    })

    input.value = ''
    updateUserBalances(address)
  }

  const getSporePower = async () => {

    if(!address || !userSporeBalance) {
      toast({
        title: 'Connect Wallet',
        description: "Please connect your wallet and wait for the page to load.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    const input = document.querySelector('#inputGetSporePower')

    if(!Number.isInteger(parseInt(input.value)) || parseInt(input.value) == 0 || input.value.length == 0) {
      toast({
        title: 'Only Numbers',
        description: "Please use only round numbers with no decimal places.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    const formattedValue = ethers.utils.parseEther(input.value)
    const inputValue = parseInt(input.value)

    if(formatNumber(userSporeBalance) < inputValue) {
      toast({
        title: 'Not Enough Funds',
        description: "Please make sure you have enough funds to proceed.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    if(parseInt(userAllowancePurchasePower) < parseInt(formattedValue)) {
      toast({
        title: 'Approve Transaction',
        description: "Please approve the sale contract to spend your Spore.",
        status: 'info',
        duration: 6000,
        isClosable: true,
      })

      const sporeContractSigner = sporeContract.connect(injectedSigner);
      const approveTX = await sporeContractSigner.approve(POWERSALE.address, formattedValue)
      
      toast({
        title: 'Approving Transaction',
        description: "Please wait until the transaction is approved.",
        status: 'info',
        duration: 6000,
        isClosable: true,
      })

      await approveTX.wait()

      if(approveTX) {
        toast({
          title: 'Approve Success!',
          description: "You have successfully approved the request.",
          status: 'success',
          duration: 6000,
          isClosable: true,
        })
        setUserAllowancePurchasePower(formattedValue)
      }
    }

    toast({
      title: 'Confirm Transaction',
      description: "Please confirm the transaction in your wallet to proceed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    const powerSaleContractSigner = powerSaleContract.connect(injectedSigner)
    const approvePurchaseTX = await powerSaleContractSigner.purchase(formattedValue)
    
    toast({
      title: 'Confirming Transaction',
      description: "Please wait until the transaction is confirmed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    await approvePurchaseTX.wait()
    
    if(!approvePurchaseTX) {
      toast({
        title: 'Transaction Failed',
        description: "Please refresh the page and try again.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }

    toast({
      title: 'Transaction Success!',
      description: "You have successfully purchased the tokens.",
      status: 'success',
      duration: 6000,
      isClosable: true,
    })
    input.value = ''
    updateUserBalances(address)
  }

  const stakeCondorNFT = async () => {

    if(!address || !userNFTBalance || !userAvailableStaking) {
      toast({
        title: 'Connect Wallet',
        description: "Please connect your wallet and wait for the page to load.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    const input = document.querySelector('#inputStakeCondorNFT')

    if(!Number.isInteger(parseInt(input.value)) || parseInt(input.value) == 0 || input.value.length == 0) {
      toast({
        title: 'Only Numbers',
        description: "Please use only round numbers with no decimal places.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    const inputValue = parseInt(input.value)

    if(parseInt(userAvailableStaking) == 0) {
      toast({
        title: 'No Slot Available',
        description: "You can stake 1 NFT by 5 Spore Power you hold.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    if(parseInt(userNFTBalance) < inputValue) {
      toast({
        title: 'Not Enough Funds',
        description: "Please make sure you have enough funds to proceed.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    if(userAllowanceStakeNFT == false) {
      toast({
        title: 'Approve NFTs',
        description: "Please approve the staking contract to use your NFTs.",
        status: 'info',
        duration: 6000,
        isClosable: true,
      })
      const nftContractSigner = nftContract.connect(injectedSigner);
      const approveTX = await nftContractSigner.setApprovalForAll(STAKING.address, true)
      
      toast({
        title: 'Approving NFTs',
        description: "Please wait until the NFTs are approved.",
        status: 'info',
        duration: 6000,
        isClosable: true,
      })

      await approveTX.wait()

      if(approveTX) {
        toast({
          title: 'Approve Success!',
          description: "You have successfully approved the request.",
          status: 'success',
          duration: 6000,
          isClosable: true,
        })
        setUserAllowanceStakeNFT(true)
      }
    }

    toast({
      title: 'Confirm Transaction',
      description: "Please confirm the transaction in your wallet to proceed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    const stakingContractSigner = stakingContract.connect(injectedSigner)
    const approveStakingTX = await stakingContractSigner.stake(inputValue, "0x0000")
    
    toast({
      title: 'Confirming Transaction',
      description: "Please wait until the transaction is confirmed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    await approveStakingTX.wait()
    
    if(!approveStakingTX) {
      toast({
        title: 'Transaction Failed',
        description: "Please refresh the page and try again.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }

    toast({
      title: 'NFTs Staked!',
      description: "You have successfully staked your nfts.",
      status: 'success',
      duration: 6000,
      isClosable: true,
    })
    input.value = ''
    updateUserBalances(address)
  }

  const unstakeCondorNFT = async () => {

    if(!address || !userNFTBalance || !userStakedBalance) {
      toast({
        title: 'Connect Wallet',
        description: "Please connect your wallet and wait for the page to load.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    const input = document.querySelector('#inputUnstakeCondorNFT')

    if(!Number.isInteger(parseInt(input.value)) || parseInt(input.value) == 0 || input.value.length == 0) {
      toast({
        title: 'Only Numbers',
        description: "Please use only round numbers with no decimal places.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    const inputValue = parseInt(input.value)

    if(inputValue > parseInt(userStakedBalance)) {
      toast({
        title: 'Not Available',
        description: "You don't have that amount of NFTs staked.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return;
    }

    toast({
      title: 'Confirm Transaction',
      description: "Please confirm the transaction in your wallet to proceed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    const stakingContractSigner = stakingContract.connect(injectedSigner)
    const approveStakingTX = await stakingContractSigner.unstake(inputValue, "0x0000")
    
    toast({
      title: 'Confirming Transaction',
      description: "Please wait until the transaction is confirmed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    await approveStakingTX.wait()
    
    if(!approveStakingTX) {
      toast({
        title: 'Transaction Failed',
        description: "Please refresh the page and try again.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }

    toast({
      title: 'NFTs Unstaked!',
      description: "You have successfully unstaked the nfts.",
      status: 'success',
      duration: 6000,
      isClosable: true,
    })
    input.value = ''
    updateUserBalances(address)
  }

  const claimRewads = async () => {

    if(!address || !userPendingRewards) {
      toast({
        title: 'Connect Wallet',
        description: "Please connect your wallet and wait for the page to load.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return
    }

    if(userPendingRewards == 0) {
      toast({
        title: 'Not Available',
        description: "You don't have any pending rewards.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return
    }

    toast({
      title: 'Confirm Transaction',
      description: "Please confirm the transaction in your wallet to proceed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    const stakingSaleContractSigner = stakingContract.connect(injectedSigner)
    const approveClaimTX = await stakingSaleContractSigner.claim()
    
    toast({
      title: 'Confirming Transaction',
      description: "Please wait until the transaction is confirmed.",
      status: 'info',
      duration: 6000,
      isClosable: true,
    })

    await approveClaimTX.wait()
    
    if(!approveClaimTX) {
      toast({
        title: 'Transaction Failed',
        description: "Please refresh the page and try again.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }

    toast({
      title: 'Rewards Claimed!',
      description: "You have successfully claimed your rewards.",
      status: 'success',
      duration: 6000,
      isClosable: true,
    })
    updateUserBalances(address)
  }

  const getMaxSporePower = async () => {
    if(!address || !userSporeBalance) {
      toast({
        title: 'Connect Wallet',
        description: "Please connect your wallet and wait for the page to load.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return
    }
    
    document.querySelector('#inputGetSporePower').value = formatNumber(userSporeBalance)
  }

  const getMaxCondorNFT = async () => {
    if(!address || !userSporeBalance || !priceCondorNFT) {
      toast({
        title: 'Connect Wallet',
        description: "Please connect your wallet and wait for the page to load.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return
    }

    const maxPurchase = parseInt(formatNumber(userSporeBalance)/formatNumber(priceCondorNFT))
    document.querySelector('#inputGetCondorNFT').value = maxPurchase
  }

  const getMaxStakeNFT = async () => {
    if(!address || !userNFTBalance) {
      toast({
        title: 'Connect Wallet',
        description: "Please connect your wallet and wait for the page to load.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return
    }

    document.querySelector('#inputStakeCondorNFT').value = parseInt(userNFTBalance)
  }

  const getMaxUnstakeNFT = async () => {
    if(!address || !userStakedBalance) {
      toast({
        title: 'Connect Wallet',
        description: "Please connect your wallet and wait for the page to load.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
      return
    }

    document.querySelector('#inputUnstakeCondorNFT').value = parseInt(userStakedBalance)
  }

  const connect = useCallback(async () => {
    try {
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const address = await signer.getAddress()
        const net = await provider.getNetwork()

        connection.on("chainChanged", chainId => {
            if(chainId != 56) {
              toast({
                title: 'Wrong Network',
                description: "Please connect to the Binance Smart Chain network.",
                status: 'error',
                duration: 6000,
                isClosable: true,
              })
            }
        })
      
        connection.on("accountsChanged", (accounts) => {
            setAddress(accounts[0])

            setUserBnbBalance(0)
            setUserSporeBalance(0)
            setUserCondorBalance(0)
            setUserPowerBalance(0)
            setUserStakedBalance(0)
            setUserPendingRewards(0)
            setUserNFTBalance(0)

            setUserAllowancePurchasePower(0)
            setUserAllowancePurchaseNFT(0)
            setUserAllowanceStakeNFT(0)
            setUserAvailableStaking(0)
        });
      
        connection.on("disconnect", (code, reason) => {
            disconnect()
        });

        if(net.chainId == 56) {
          setInjectedProvider(provider)
          setInjectedSigner(signer)
        }
        else{
          toast({
            title: 'Wrong Network',
            description: "Please connect to the Binance Smart Chain network.",
            status: 'error',
            duration: 6000,
            isClosable: true,
          })
        }

        setAddress(address)
    } catch (error) {
      toast({
        title: 'Connect Error',
        description: "Please refresh the page and try again.",
        status: 'error',
        duration: 6000,
        isClosable: true,
      })
    }
  }, [])

  const disconnect = useCallback(async function () {
    setAddress('')
    setInjectedProvider('')
    setInjectedSigner('')
    await web3Modal.clearCachedProvider()
    location.reload()
  }, [injectedProvider])


useEffect(() => {
  if (web3Modal.cachedProvider) {
    connect()
  }
}, [connect])

useEffect(() => {
  if(injectedProvider) {
    loadContracts()
  }
}, [injectedProvider, injectedSigner]);

useEffect(() => {
  if(sporeContract && condorContract && powerContract && stakingContract && nftContract && nftSaleContract && powerSaleContract) {
    loadDefaultValues()
  }
}, [sporeContract, condorContract, powerContract, stakingContract, nftContract, nftSaleContract, powerSaleContract]);

useEffect(() => {
  if(address) {
    updateUserBalances(address)
  }
}, [address])

useEffect(() => {
  const interval = setInterval(async () => {
    if(address) {
      const pendingRewards = await stakingContract.takeWithAddress(address)
      setUserPendingRewards(formatNumber6Dec(pendingRewards))
    }
  }, 10000);
  return () => clearInterval(interval);
}, [address])

  return (
    <>
    <Head>
        <title>Condor Staking NFT UI</title>
        <link rel="shortcut icon" href="icon.png" />
    </Head>
    
    <Box
        as="section"
      >
        <Box as="nav" bg="bg-surface" boxShadow={useColorModeValue('sm', 'sm-dark')}>
          <Container py={{ base: '4', lg: '5'}}>

            <HStack spacing="10" justify="space-between">
              <Logo />
              {isDesktop ? (
                <Flex justify="space-between" flex="1">
                  <ButtonGroup variant="link" spacing="8">
                    {['Condor NFT Staking Module'].map((item) => (
                      <Button key={item}>{item}</Button>
                    ))}
                  </ButtonGroup>
                  <HStack spacing="3">
                  {address ? (
                      <Button colorScheme='gray' onClick={disconnect}>Connected</Button>
                  ) : (
                      <Button colorScheme='red' onClick={connect}>Connect Wallet</Button>
                  )}
                  </HStack>
                </Flex>
              ) : (
                address ? (
                  <Button colorScheme='gray' onClick={disconnect}>Connected</Button>
                ) : (
                    <Button colorScheme='red' onClick={connect}>Connect Wallet</Button>
                )
              )}
            </HStack>
          </Container>
        </Box>
    </Box>

    <Box as="section" py={{ base: '4', md: '8'}}>
      <Container>
        <SimpleGrid columns={{ base: 1, md: 5}} gap={{ base: '5', md: '6'}}>
          <Skeleton isLoaded={!address ? true:userSporeBalance}>
            <HeaderStat label='Your Spore Balance' value={userSporeBalance ? formatNumber(userSporeBalance):0} />
          </Skeleton>
          
          <Skeleton isLoaded={!address ? true:userPowerBalance}>
            <HeaderStat label='Your Power Balance' value={userPowerBalance ? formatNumber(userPowerBalance):0} />
          </Skeleton>
          
          <Skeleton isLoaded={!address ? true:userCondorBalance}>
            <HeaderStat label='Your Condor Balance' value={userCondorBalance ? formatNumber(userCondorBalance):0} />
          </Skeleton>
          
          <Skeleton isLoaded={!address ? true:userNFTBalance}>
            <HeaderStat label='Your NFT Balance' value={userNFTBalance ? parseInt(userNFTBalance):0} />
          </Skeleton>
          
          <Skeleton isLoaded={!address ? true:userStakedBalance}>
            <HeaderStat label='Your Staked NFTs' value={userStakedBalance ? parseInt(userStakedBalance):0} />
          </Skeleton>
        </SimpleGrid>

        
      </Container>
    </Box>

    <Container>
      <Box px={{ base: '4', md: '6'}} py={{ base: '5', md: '6'}} w='100%' p={4} bg="bg-surface" borderRadius="lg" boxShadow={useColorModeValue('sm', 'sm-dark')}>
        
        <SimpleGrid columns={{ base: 1, md: 3}} gap={{ base: 5, md: 6}}>
          <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
            <Center>
              <Image
                  htmlHeight='120px'
                  htmlWidth='120px'
                  src='/spore-power-logo.png'
                  alt='Spore Power'
                />
            </Center>
            <Heading size="md">Get Spore Power</Heading>
            <Stack spacing="6">
              <li>You can get as much Spore Power Tokens as you need.</li>
              <li>Spore Power Tokens have 1:1 relationship ratio with Spore Token.</li>
              <li>Spore Power Tokens can only be purchased with <a target="_blank" href="https://pancakeswap.finance/swap?inputCurrency=0x77f6a5f1b7a2b6d6c322af8581317d6bb0a52689" rel="noopener noreferrer"><strong>Spore Tokens from BSC on Pancakeswap</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>Spore Power Tokens will represent your voting power on the <a target="_blank" href="https://snapshot.org/#/spore-engineering.eth" rel="noopener noreferrer"><strong>Snapshot DAO Governance</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>All Spore Tokens from purchases will be transferred to the <a target="_blank" href="https://bscscan.com/address/0x79207f009733a9770ede24f7fd7b8e02b2a25222" rel="noopener noreferrer"><strong>Gnosis Safe DAO multisig burner wallet</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>Read more abour Spore Power on <a target="_blank" href="https://spore-eng.medium.com/govern-vote-on-protocol-proposals-without-spending-on-gas-fees-dc8ea7818d33" rel="noopener noreferrer"><strong>this Medium article</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
            </Stack>
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
              <InputGroup size='md'>
                <Input pr='4.5rem' type='text' placeholder='Spore Amount' id='inputGetSporePower' />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={getMaxSporePower}>
                    max
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaBolt />} onClick={getSporePower}>
                Get Spore Power
              </Button>
            </Stack>
          </Stack>

          <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
          <Center>
              <Image
                  htmlHeight='140px'
                  htmlWidth='140px'
                  src='/condor-logo.svg'
                  alt='Condor NFT'
                />
            </Center>
            <Heading size="md">Get Condor NFT</Heading>
            <Stack spacing="6">
              <li>You can get as much NFTs as you need.</li>
              <li>Condor NFTs follow the ERC1155 Standard.</li>
              <li>Each NFT cost {priceCondorNFT ? formatNumber(priceCondorNFT):'~'} Spore Tokens.</li>
              <li>NFTs can only be purchased with <a target="_blank" href="https://pancakeswap.finance/swap?inputCurrency=0x77f6a5f1b7a2b6d6c322af8581317d6bb0a52689" rel="noopener noreferrer"><strong>Spore Tokens from BSC on Pancakeswap</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>Read more about the <a target="_blank" href="https://spore-eng.medium.com/welcome-condor-protocol-53268abb6ee1" rel="noopener noreferrer"><strong>initial idea and vision</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>Learn more about Condor and <a target="_blank" href="https://spore-eng.medium.com/condor-protocol-mainnet-pre-mining-is-open-51c19ef5fc0a" rel="noopener noreferrer"><strong>how the staking mechanism works</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
              <li>There's also an interesting <a target="_blank" href="https://github.com/condor-vision/v1-contracts-monorepo" rel="noopener noreferrer"><strong>cross-chain bridge proposal</strong><FaExternalLinkAlt style={{display:'inline', marginLeft: '5px'}} /></a></li>
            </Stack>
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
              <InputGroup size='md'>
                <Input pr='4.5rem' type='text' placeholder='NFT Amount' id='inputGetCondorNFT' />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={getMaxCondorNFT}>
                    max
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaFeather />} onClick={getCondorNFT}>
                Get Condor NFT
              </Button>
            </Stack>
          </Stack>

          <Box>
            <Heading size={useBreakpointValue({ base: 'sm', md: 'md'})}>
              Stake Condor NFT
            </Heading>
            <Text color="muted" mt="5">
                Here you can stake your Condor NFT tokens, unstake them, and claim your rewards in Condor tokens.

                Remember that in order to stake Condor NFT tokens, you must hold Spore Power Tokens in a 5 to 1 ratio, meaning that by 5 Spore Power tokens you possess, you will be able to stake 1 Condor NFT token in the pool.
            </Text>
            <Divider my="5" />
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full" mb='5'>
              <InputGroup size='md'>
                <Input pr='4.5rem' type='text' placeholder='NFT Amount' id='inputStakeCondorNFT' />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={getMaxStakeNFT}>
                    max
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaAngleDoubleDown />} onClick={stakeCondorNFT}>
                Stake NFTs
              </Button>
            </Stack>
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full" mb='5'>
              <InputGroup size='md'>
                <Input pr='4.5rem' type='text' placeholder='NFT Amount' id='inputUnstakeCondorNFT' />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={getMaxUnstakeNFT}>
                    max
                  </Button>
                </InputRightElement>
              </InputGroup>
              <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaAngleDoubleUp />} onClick={unstakeCondorNFT}>
                Unstake NFTs
              </Button>
            </Stack>
            <Stack spacing="8" borderWidth="1px" rounded="lg" padding="8" width="full">
                <Stat>
                  <StatLabel>Your Available Condor Token Rewards</StatLabel>
                  
                  <Skeleton isLoaded={!address && !userPendingRewards || userPendingRewards == 0 ? true:userPendingRewards}>
                    <Heading size={useBreakpointValue({ base: 'sm', md: 'md'})}>
                      {userPendingRewards ? userPendingRewards:0}
                    </Heading>
                  </Skeleton>
                </Stat>
                
                <Button colorScheme='linkedin' size="lg" fontSize="md" rightIcon={<FaCoins />} onClick={claimRewads}>
                  Claim Your Coins
                </Button>
            </Stack>
          </Box>
          
        </SimpleGrid>
      </Box>
    </Container>

    <Footer />
      
    </>
  )
}
