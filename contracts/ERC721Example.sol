// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Import this file to use console.log
import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract NFTSample is ERC721PresetMinterPauserAutoId {
  constructor() ERC721PresetMinterPauserAutoId("NFT Sample", "NSMP", "") {}
}
