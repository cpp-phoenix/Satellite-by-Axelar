import { ConnectButton } from '@rainbow-me/rainbowkit';
import { NavLink as Link } from 'react-router-dom';

function Navbar () {
    return (
        <div className="bg-black flex items-center justify-between w-full h-24 px-12 border-b border-gray-500">
            <Link className="flex flex-row space-x-4 items-center font-semibold text-3xl text-white" to='/'>
                <img src="https://satellite.money/assets/ui/satellite.logo.svg" />
                <div>XLR-Bridge</div>
            </Link>
            <div className="space-x-32 text-white">
                <Link className="font-semibold hover:font-bold text-md" to='/'>Token Bridge</Link>
                {/* <Link className="font-semibold hover:font-bold text-md" to='/'>NFT Bridge</Link> */}
                <Link className="font-semibold hover:font-bold text-md" to='/pools'>Liquidity</Link> 
                {/* <Link className="font-semibold text-lg" to='/stats'>Analytics</Link> */}
            </div>
            <div className="">
                <ConnectButton chainStatus="icon" showBalance={false}/>
            </div>
        </div>
    )
}

export default Navbar;