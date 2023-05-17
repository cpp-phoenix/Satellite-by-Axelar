import { useNetwork, useAccount, erc20ABI, useProvider, useSigner } from 'wagmi';
import { useEffect, useState } from 'react';
import { useAlert, positions } from 'react-alert';
import { ethers } from "ethers";
import xlrcoreabi from "../abis/xlrcoreabi.json";

function Swap() {

    const alert = useAlert()

    const { chain, chains } = useNetwork();
    const { isConnected, address } = useAccount();
    const [toChain, setToChain] = useState("Select");
    const [toChainId, setToChainId] = useState(0);
    const [toChainSelect, toggleToChainSelect] = useState(false);
    const [swapTo, setSwapTo] = useState(0);
    const [swapFrom, setSwapFrom] = useState(0);
    const [toPayLoading, toggleToPayLoading] = useState(false);
    const [tokenFrom, setTokenFrom] = useState({
        token: "Select"
    });
    const [tokenTo, setTokenTo] = useState({
        token: "-"
    });
    const [showFromTokenList, setShowFromTokenList] = useState(false);
    const { data: signer } = useSigner()

    const chainObj = {
        5: {
            chainId: 5,
            chianName: "Goerli",
            explorer: "https://goerli.etherscan.io/tx/",
            rpc: "https://goerli.infura.io/v3/",
            zeroX: "https://goerli.api.0x.org/",
            receiverContract: "0xf151df49884087a5075143a496a73bdf1e2be6fa",
            hashiPoolContract: "0xA67D503FaC6dA1A41F454D45Bebce7165c09F195",
            domain: "ethereum-2",
            tokens: [
                {
                    token: "USDT",
                    address: "0x69c9e542c9234a535b25df10e5a0f8542670d44a",
                    decimals: 18
                },
                {
                    token: "USDC",
                    address: "0x89a543c56f8fc6249186a608bf91d23310557382",
                    decimals: 18
                },
                {
                    token: "DAI",
                    address: "0x0e3b53f09f0e9b3830f7f4a3abd4be7a70713a31",
                    decimals: 18
                }
            ]
        },
        80_001: {
            chainId: 80_001,
            chianName: "Mumbai",
            explorer: "https://mumbai.polygonscan.com/tx/",
            rpc: "https://matic-mumbai.chainstacklabs.com",
            zeroX: "https://mumbai.api.0x.org/",
            receiverContract: "0x32f80437bb4ce60e0ace378c32323b016545213e",
            hashiPoolContract: "0xf151dF49884087A5075143a496a73BDf1e2bE6fA",
            domain: "Polygon",
            tokens: [
                {
                    token: "USDT",
                    address: "0x07cD0B7fC7979CFd1a76b124F551E981944eFF41",
                    decimals: 18
                },
                {
                    token: "USDC",
                    address: "0x4d344098b124fead012fc54b91f3099e1fec06f6",
                    decimals: 18
                },
                {
                    token: "DAI",
                    address: "0x8ebf563bc9a267b71b4e6055279d3cf4d3b368ee",
                    decimals: 18
                }
            ]
        },
        1_287: {
            chainId: 1_287,
            chianName: "Moonbase Alpha",
            explorer: "https://moonbase-blockscout.testnet.moonbeam.network/tx/",
            rpc: "https://rpc.testnet.moonbeam.network",
            zeroX: "https://mumbai.api.0x.org/",
            receiverContract: "0x7ff62c41a99dcf968395cc47eaa5014efd9b3a4b",
            hashiPoolContract: "0xd4B71e9D524FB4925c8C3044b45f5FdABbad976e",
            domain: "Moonbeam",
            tokens: [
                {
                    token: "USDT",
                    address: "0x14c5f75466f4719d5d405e3ff0b7d181ce8ee1cc",
                    decimals: 18
                },
                {
                    token: "USDC",
                    address: "0x2dEcD02F465E5e60B34598A2E0F2B0a2759377FD",
                    decimals: 18
                },
                {
                    token: "DAI",
                    address: "0x9ad872caba5320ef0ed49a52f69a3d159525f485",
                    decimals: 18
                }
            ]
        },
        97: {
            chainId: 97,
            chianName: "BSC Testnet",
            explorer: "https://bscscan.com/tx/",
            rpc: "https://data-seed-prebsc-1-s1.binance.org:8545/",
            receiverContract: "0x7ff62c41a99dcf968395cc47eaa5014efd9b3a4b",
            hashiPoolContract: "0xd4B71e9D524FB4925c8C3044b45f5FdABbad976e",
            domain: 1287,
            tokens: [
                {
                    token: "USDT",
                    address: "0x14c5f75466f4719d5d405e3ff0b7d181ce8ee1cc",
                    decimals: 18
                },
                {
                    token: "USDC",
                    address: "0x9ad872caba5320ef0ed49a52f69a3d159525f485",
                    decimals: 18
                },
                {
                    token: "DAI",
                    address: "0x2decd02f465e5e60b34598a2e0f2b0a2759377fd",
                    decimals: 18
                }
            ]
        }
    }

    useEffect(() => {
        
    },[chain?.id])  

    const sendTransaction = async () => {
        if(swapFrom > 0 && swapTo > 0 && toChainId > 0) {
            console.log(toChainId);
            const tokenTodd = {}
            chainObj[toChainId].tokens.filter(token => token.token === tokenTo.token).map(tokenObj => Object.assign(tokenTodd,tokenObj));
            console.log(chainObj[toChainId].domain);
            setTokenTo(tokenTodd);
            
            const contract = new ethers.Contract(tokenFrom.address, erc20ABI, signer);
            const allowed = await contract.allowance(address, chainObj[chain.id].receiverContract);
            let  amount = String(swapFrom * 10 ** tokenFrom.decimals);
            console.log(parseInt(allowed.toString(),10));
            console.log(parseInt(amount,10));
            console.log(parseInt(allowed.toString(),10) < parseInt(amount,10));
            let txn;
            if(parseInt(allowed.toString(),18) < parseInt(amount,18)) {
                try {
                    txn = await contract.approve(chainObj[chain.id].receiverContract, amount);
                    alert.success(
                        <div>
                            <div>Transaction Sent</div>
                            <button className='text-xs' onClick={()=> window.open(chainObj[chain.id].explorer + txn.hash, "_blank")}>View on explorer</button>
                        </div>, {
                        timeout: 0,
                        position: positions.BOTTOM_RIGHT
                    });
                } catch(ex) {
                    console.log(ex);
                    alert.error(<div>Operation failed</div>, {
                        timeout: 3000,
                        position: positions.TOP_RIGHT
                    });
                }
            } else {
                const hashiPoolContract = new ethers.Contract(chainObj[chain.id].receiverContract, xlrcoreabi, signer);
                try{
                    txn = await hashiPoolContract.initiateBridge(chainObj[toChainId].domain, chainObj[toChainId].receiverContract, tokenTodd.address, tokenFrom.address, amount, { value: ethers.utils.parseUnits("700000", "gwei") });
                    console.log(txn);
                    alert.success(
                        <div>
                            <div>Transaction Sent</div>
                            <button className='text-xs' onClick={()=> window.open("https://testnet.axelarscan.io/gmp/" + txn.hash, "_blank")}>View on explorer</button>
                        </div>, {
                        timeout: 0,
                        position: positions.BOTTOM_RIGHT
                    });
                } catch(ex) {
                    console.log(ex);
                    alert.error(<div>Operation failed</div>, {
                        timeout: 3000,
                        position: positions.TOP_RIGHT
                    });
                }
            }
        } else {
            alert.error(<div>Invalid input</div>, {
                timeout: 3000,
                position: positions.TOP_RIGHT
            });
        }
    }

    const getPrice = async (targetValue) => {
        if(targetValue > 0) {
            toggleToPayLoading(true);
            console.log(targetValue);
            setSwapFrom(targetValue);
            setSwapTo(targetValue);
            toggleToPayLoading(false);
        }   
    }


    return (
        <div className="flex flex-1 justify-center items-center h-[630px] mt-10">
        {
            isConnected && 
            <div className="flex flex-col justify-between rounded-lg font-semibold w-4/12 h-5/6 bg-gray-800">
                <div className="text-2xl mx-4 mt-4 text-white font-normal">Bridge</div>
                <div className="bg-gray-900 text-white rounded-lg h-[150px] mx-6 p-4 px-6">
                    <div>
                        <div>From</div>
                        <div className="flex flex-row items-center h-[75px]">
                            <div className="flex items-center justify-center px-2 py-2 mx-2 border border-gray-700 rounded-lg">
                                <div>
                                    {chain?.name}
                                </div>
                            </div>
                            <div className="flex-1 flex items-center px-2 py-1 mx-2 border border-gray-700 rounded-lg">
                                <input onChange={(e) => {getPrice(e.target.value)}} class="placeholder:text-slate-400 block bg-gray-900 w-full py-2 pl-2 pr-3 shadow-sm focus:outline-none sm:text-sm" placeholder="" type="number" name="toAmount"/>       
                            </div>
                            <div className="flex items-center px-2 py-2 mx-2 border border-gray-700 rounded-lg">
                                {showFromTokenList && 
                                    <div className="absolute rounded-lg bg-black border border-gray-700 mt-40">
                                        {
                                            (chainObj[chain.id].tokens.filter(token => token.address !== tokenTo.address).map(token => <div onClick={() => {setShowFromTokenList(!showFromTokenList); setTokenFrom(token); setTokenTo(token)}} className="rounded p-2 px-4 hover:cursor-pointer hover:bg-gray-800" >{token.token}</div>))
                                        }
                                    </div>
                                }
                                <div onClick={() => setShowFromTokenList(!showFromTokenList)} className="hover:cursor-pointer">
                                    {tokenFrom.token} v
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center'>
                <img src="https://satellite.money/assets/ui/double-arrows.svg" className='w-8 h-8'/>
                </div>
                <div className="bg-gray-900 text-white rounded-lg h-[150px] mx-6 p-4 px-6">
                    <div>
                        <div>To</div>
                        { toChainSelect && 
                            <div className="absolute rounded-lg bg-gray-900 border border-gray-700 mt-16 mx-2 w-content">
                                { 
                                    chains.filter((chainss) => chainss.id !== chain.id).map((chain) => <div onClick={() => {setToChain(chain.name); setToChainId(chain?.id); toggleToChainSelect(!toChainSelect)}} className="flex justify-center py-2 px-2 hover:bg-gray-800 hover:cursor-pointer">{chain.name}</div>)
                                }
                            </div>
                        }
                        
                        <div className="flex flex-row items-center justify-center h-[75px] hover:cursor-pointer">
                            <div onClick={() => toggleToChainSelect(!toChainSelect)} className="flex items-center justify-center px-2 py-2 mx-2 border border-gray-800 rounded-lg">
                                <div>
                                    {toChain} v
                                </div>
                            </div>
                            <div className="flex-1 flex items-center px-2 py-2 mx-2 border border-gray-800 rounded-lg">
                                {swapTo}
                            </div>
                            <div className="flex items-center px-2 py-2 mx-2 border border-gray-800 rounded-lg">
                                <div>
                                    {tokenTo.token}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={() => sendTransaction()} className=" w-full rounded-b-lg text-xl text-white py-4 bg-blue-500 mt-6">Initiate</button>
            </div>
        }
        </div>
    )
}
export default Swap;