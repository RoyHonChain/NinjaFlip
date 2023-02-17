// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// Deployed to Goerli 0x36B8607c7299480D44E556C55675933766576309
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NinjaFlip {
    
    address public owner;
    address public ERC20Contract;

    uint8 public tax;

    enum StateType {
        init,
        commited,
        win,
        lose
    }

    struct Game {
        uint256 blockNumber;
        uint8 choose;       //0=plus, 1=minus
        uint256 amount;
        StateType state;
        uint256 nonce;
    }

    mapping(address=>Game) public playerRec;

    constructor(address _ERC20Contract,uint8 _tax){
        owner=msg.sender;
        ERC20Contract=_ERC20Contract;
        tax=_tax;
    }

    function commitBet(uint8 _choose,uint256 _amount) public {
        require(playerRec[msg.sender].state != StateType.commited,"please reveal the least game first!");
        require(IERC20(ERC20Contract).balanceOf(msg.sender)>=_amount,"You're too poor");
        require(IERC20(ERC20Contract).balanceOf(address(this))>=_amount,"I'm too poor");
        require(IERC20(ERC20Contract).transferFrom(msg.sender, address(this), _amount),"transfer error");

        playerRec[msg.sender].blockNumber=block.number;
        playerRec[msg.sender].choose=_choose;
        playerRec[msg.sender].amount=_amount;
        playerRec[msg.sender].state=StateType.commited;
        playerRec[msg.sender].nonce++;
        
    }
    
    function reveal() public{

        require(playerRec[msg.sender].state==StateType.commited,"You have no game to reveal~");
        require(block.number-playerRec[msg.sender].blockNumber>=1,"Please wait 1 block and try again~");
        
        bytes32 randomBytes = keccak256(abi.encodePacked(playerRec[msg.sender].nonce, msg.sender, blockhash(playerRec[msg.sender].blockNumber)));
        uint256 rand=uint256(randomBytes)%2;

        if(rand==playerRec[msg.sender].choose){
            playerRec[msg.sender].state=StateType.win;
            IERC20(ERC20Contract).transfer(msg.sender, playerRec[msg.sender].amount*2*(100-tax)/100);
            console.log("you win");
        }
        else{
            playerRec[msg.sender].state=StateType.lose;
            console.log("you lose");
        }
        console.log("rand=",rand);
    }

    
    
    function withdraw() public onlyOwner {
        IERC20(ERC20Contract).transfer(
            owner,
            IERC20(ERC20Contract).balanceOf(address(this))
        );
    }

    
    function changeERC20(address _ERC20Contract) public onlyOwner {
        ERC20Contract=_ERC20Contract;
    }

    function changeTax(uint8 _tax) public onlyOwner {
        tax=_tax;
    }


    

    modifier onlyOwner {
        require(msg.sender==owner,"You should not pass!");
        _;
    }
}