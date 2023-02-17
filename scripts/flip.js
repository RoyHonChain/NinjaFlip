const hre = require("hardhat");

//gold contract address=0x5FbDB2315678afecb367f032d93F642f64180aa3
//flip contract address=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512

async function main(){
    const [owner,player1,player2] = await hre.ethers.getSigners();

    const Gold = await hre.ethers.getContractFactory("Gold");
    const gold = await Gold.deploy(100000);
    await gold.deployed;
    console.log(`gold deployed ${gold.address}`);
    
    const NinjaFlip = await hre.ethers.getContractFactory("NinjaFlip");
    const ninjaFlip = await NinjaFlip.deploy(gold.address,5);
    await ninjaFlip.deployed();
    console.log(`ninjaFlip deployed ${ninjaFlip.address}`);
    
    function delay(n){
        return new Promise(function(resolve){
            setTimeout(resolve,n*1000);
        });
    }
    
    await gold.connect(owner).transfer(ninjaFlip.address,50000);
    await gold.connect(owner).approve(ninjaFlip.address,"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");




    let winCount=0;
    let loseCount=0;

    for(let i=0;i<1;i++){
        const a=await ninjaFlip.connect(owner).commitBet(1,1000,{gasLimit: 1000000});
        await a.wait();
        console.log("player balance:",await gold.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
        console.log("casino balance:",await gold.balanceOf(ninjaFlip.address));
        

        await delay(1);

        const reveal = await ninjaFlip.connect(owner).reveal({gasLimit: 1000000});
        await reveal.wait();
        const abc = await ninjaFlip.connect(owner).playerRec("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",{gasLimit: 1000000});
        console.log("w/l=",abc.state);
        if(abc.state==2){
            winCount++;
            console.log("----win!----");
            console.log("player balance:",await gold.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));
            console.log("casino balance:",await gold.balanceOf(ninjaFlip.address));
        }
        else if(abc.state==3)
            loseCount++;
        
        console.log("times:",i);
        console.log("winCount:",winCount);
        console.log("loseCount:",loseCount);
    }

    /*const w = await ninjaFlip.connect(owner).withdraw();
    await w.wait();
    await console.log("casino balance:",await gold.balanceOf(ninjaFlip.address));
    console.log("player balance:",await gold.balanceOf("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"));*/

    

    
    
}

main();