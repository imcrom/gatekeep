import React,{useEffect, useState} from 'react'
import '../App.css'
import { Typography, Button } from '@mui/material'
import { ethers } from 'ethers'
import { Web3Provider } from '@ethersproject/providers';
import {TOKEN_ABI} from '../tokenABI'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#803FBF',
  border: '2px solid #efef',
  boxShadow: 24,
  p: 4,
};

export const Banner = () => {

    const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false)
    const [isConnected, setIsConnected] = useState(false)
    const [isCancelled, setIsCancelled] = useState(false)
    const [balance, setBalance] = useState(0)
    const [address, setAddress] = useState('')
    const [username, setUsername] = useState('')
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    // test
    const tokenAddress = '0x2f25ea915811f23be33e0910a2dc8ff43e4ce14a'


    async function request() {
      try {
        const response = await fetch("http://localhost:5000/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({'username': username , 'address': address})
        });
        const data = await response.json();
      } catch (error) {
        console.error(error);
      }
    }


    useEffect(() => {
      if (window.ethereum || window.web3) {
        setIsMetaMaskInstalled(true);
        const provider = new Web3Provider(
          window.ethereum || window.web3.currentProvider
        );
        const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, provider);
        // Request access to the user's accounts
        window.ethereum.enable().then(() => {
          provider.getSigner().getAddress().then((wall_address) => {
            // Return the address of the wallet
            console.log(wall_address);
            if (wall_address.length > 0) {
              setIsConnected(true);
              setAddress(wall_address);
              // GET BALANCE OF THE WALLET HERE
              tokenContract.balanceOf(wall_address).then((balance) => {
                // Convert the balance to a human-readable format
                const balanceFormatted = ethers.formatUnits(balance, 9);
                setBalance(balanceFormatted)

                // Log the balance to the console
                console.log(`Token balance: ${balanceFormatted}`);
              }).catch((err) => {
                console.error(err);
              });

            }
          }).catch((err) => {
            console.error(err);
          });
        }).catch((err) => {
          if (err.code === 4001) {
            setIsConnected(false);
            setIsCancelled(true);
            console.error('User rejected the request');
          } else {
            console.error(err);
          }
        });
    
        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          console.log('Accounts changed:', accounts);
          if (accounts.length > 0) {
            setIsConnected(true);
            provider.getBalance(accounts[0]).then((balance) => {
              setBalance(ethers.formatEther(balance));
              setAddress(accounts[0]);
            }).catch((err) => console.error(err));
          } else {
            setIsConnected(false);
            setAddress('');
            setBalance('0.0');
          }
        });
      } else {
        console.log('MetaMask is not installed!');
      }
    }, []);
    
      
          // Add element returns when the user cancels the connection of the wallet
    if (isCancelled) {
      return (
        <div className='flex flex-col m-autoborder-2 border-black bg-gradient-to-r from-purple-500/75 to-pink-500/75 rounded-3xl w-[40%] md:w-[90%] sm:w-full'>
            <div className='text-center text-4xl p-8 m-auto'>
              <Typography className='font-fredoka' variant='p' color='#efefef' >
                Wallet connection cancelled
              </Typography>
            </div>
            <div className='w-[50%] m-auto border-2 border-[#38BCF9] mt-4 md:text-[32px] sm:text-[1px]'>
                    <Button variant='outlined' color='secondary' sx={{color: '#efefef', width: '100%', padding: '4px'}}>
                        <a href='/' className='font-fredoka' variant='p' color='#38BCF9' >
                            Login with MetaMask
                        </a>
                    </Button>
            </div>

        </div>
      )
    }
       
      
    

    return (
        <div className='flex flex-col m-auto h-[80%] border-2 border-black bg-gradient-to-r from-purple-500/75 to-pink-500/75 rounded-3xl w-[40%] md:w-[90%] sm:w-[90%]'>
         
         
          {isMetaMaskInstalled ? (
            isConnected ? (
              <div className='text-center text-4xl md:text-4xl sm:text-[24px] p-8'>
                <Typography className='font-fredoka' variant='p' color='#efefef' >
                  Wallet is now connected!
                </Typography>
                <div className='flex flex-col mt-28 text-2xl sm:text-xl md:text-2xl md:mt-12 sm:mt-4'>
                    <Typography className='font-fredoka' variant='p' color='#efefef' >
                        Current <span className='font-bold'>$MAGIC</span> balance: <span className='font-bold underline'>{balance}</span>
                    </Typography>
                </div>
                <div className='flex flex-col mt-4 text-lg md:text-xl sm:text-[12px]'>
                    <Typography className='font-fredoka' variant='p' color='#efefef' >
                        Current wallet address: <span className='underline md:text-xl sm:text-[9px]'>{address}</span>
                    </Typography>
                </div>
                <div className='flex w-[50%] m-auto border-2 border-[#d71fed] mt-8 sm:mt-0 '>
                    <Button variant='outlined' color='secondary' sx={{color: '#efefef', width: '100%', padding: '4px'}}>
                        <a href='https://app.uniswap.org/#/swap?outputCurrency=0x2f25eA915811f23Be33e0910a2dc8Ff43E4Ce14A' className='font-fredoka md:text-2xl sm:text-[9px]' variant='p' color='#d71fed' >
                            Buy more <span className='font-bold'>$MAGIC</span> tokens
                        </a>
                    </Button>
                </div>
                <div className='w-[50%] m-auto border-2 border-[#38BCF9] mt-4'>
                    <Button variant='outlined' color='secondary' sx={{color: '#efefef', width: '100%', padding: '4px'}}>
                        <a href='https://t.me/magicai_official' className='font-fredoka md:text-2xl sm:text-[9px]' variant='p' color='#38BCF9' >
                            <span className='font-bold'>Telegram</span> channel
                        </a>
                    </Button>
                </div>



                {balance >= 20000 ? (<div className='w-[50%] m-auto border-2 border-[#38BCF9] mt-4'>
                    <Button onClick={handleOpen} variant='outlined' color='secondary' sx={{color: '#efefef', width: '100%', height:'100%', padding: '4px'}}>
                        <a className='font-fredoka md:text-2xl sm:text-[9px]' variant='p' color='#38BCF9' >
                            SETUP BOT
                        </a>
                    </Button>
                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <TextField id="filled-basic" label="Enter Telegram Username" variant="filled" className='w-full'  InputLabelProps={{style: { color: '#efefef' }}} />
                        <div className='w-full m-auto border-2 border-[#38BCF9] mt-4'>
                            <Button onClick={request} variant='outlined' color='secondary' sx={{color: '#efefef', width: '100%', height:'100%', padding: '4px'}}>
                              <a className='font-fredoka' variant='p' color='#38BCF9' >
                                  SUBMIT
                              </a>
                            </Button>
                        </div>
                        
                      </Box>
                    </Modal>
                </div>):(
                    <div className='flex text-sm md:text-xl p-4 sm:text-[12px]'>
                      <a className='text-center self-center m-auto text-[#efefef]'> You do not have enough <span className='font-bold'>$MAGIC</span> to use our bot.</a>
                    </div>
                )}



              </div>
            
            ) : (
              <div className='text-center text-4xl p-8 m-auto'>
                <Typography className='font-fredoka' variant='p' color='#efefef' >
                  Connecting your wallet...
                </Typography>
              </div>
            )
          ) : (
            <div className='text-center text-4xl p-8 m-auto'>
              <Typography className='font-fredoka' variant='p' color='#efefef' >
                MetaMask not installed
              </Typography>
            </div>
          )} 
        </div>
      );
      
}