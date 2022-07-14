import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Signer, BigNumber } from 'ethers'

const deployNFT = async (deployer: Signer) => {
  const nftSampleFactory = await ethers.getContractFactory('NFTSample')

  const nft = await nftSampleFactory.connect(deployer).deploy()
  await nft.deployed()

  return nft
}

describe('NFT Sample', () => {
  it('deployer can mint NFTs', async () => {
    const [alice, bob] = await ethers.getSigners()

    const nft = await deployNFT(alice)

    const mintTx = await nft.mint(alice.address)
    await mintTx.wait()

    const mintTx2 = await nft.mint(bob.address)
    await mintTx2.wait()

    expect(await nft.balanceOf(alice.address)).eq(BigNumber.from('1'))
    expect(await nft.ownerOf(BigNumber.from('0'))).eq(alice.address)

    expect(await nft.balanceOf(bob.address)).eq(BigNumber.from('1'))
    expect(await nft.ownerOf(BigNumber.from('1'))).eq(bob.address)
  })
})
