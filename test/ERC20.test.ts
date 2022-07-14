import { expect } from 'chai'
import { ethers } from 'hardhat'
import { Signer, utils } from 'ethers'

const deployToken = async (deployer: Signer) => {
  const tokenFactory = await ethers.getContractFactory('TokenSample')

  const token = await tokenFactory.connect(deployer).deploy()
  await token.deployed()

  return token
}

describe('Token sample', () => {
  it('sends initial balance to deployer', async () => {
    const [alice] = await ethers.getSigners()

    const token = await deployToken(alice)

    expect(await token.balanceOf(alice.address)).eq(utils.parseEther('1000'))
  })

  it('can transfer', async () => {
    const [alice, bob] = await ethers.getSigners()

    const token = await deployToken(alice)

    const amount = utils.parseEther('10')

    const tx = await token.transfer(bob.address, amount)
    await tx.wait()

    expect(await token.balanceOf(bob.address)).eq(amount)
    expect(await token.balanceOf(alice.address)).eq(utils.parseEther('1000').sub(amount))
  })
})

const deployTokenConsumer = async (tokenAddress: string) => {
  const tokenConsumerFactory = await ethers.getContractFactory('TokenConsumer')

  const tokenConsumer = await tokenConsumerFactory.deploy(tokenAddress)
  await tokenConsumer.deployed()

  return tokenConsumer
}

describe('Token Consumer', () => {
  it('can deposit approved tokens', async () => {
    const [alice] = await ethers.getSigners()

    const token = await deployToken(alice)
    const tokenConsumer = await deployTokenConsumer(token.address)

    const amount = utils.parseEther('10')

    const approveTx = await token.approve(tokenConsumer.address, amount)
    await approveTx.wait()

    const depositTx = await tokenConsumer.deposit(amount)
    await depositTx.wait()

    expect(await token.balanceOf(tokenConsumer.address)).eq(amount)
  })

  it('can withdraw deposited tokens', async () => {
    const [alice, bob] = await ethers.getSigners()

    const token = await deployToken(alice)
    const tokenConsumer = await deployTokenConsumer(token.address)

    const depositAmount = utils.parseEther('10')

    const approveTx = await token.approve(tokenConsumer.address, depositAmount)
    await approveTx.wait()

    const depositTx = await tokenConsumer.deposit(depositAmount)
    await depositTx.wait()

    const withdrawAmount = utils.parseEther('5')

    const withdrawTx = await tokenConsumer.connect(bob).withdraw(withdrawAmount)
    await withdrawTx.wait()

    expect(await token.balanceOf(tokenConsumer.address)).eq(depositAmount.sub(withdrawAmount))
    expect(await token.balanceOf(bob.address)).eq(withdrawAmount)
  })
})
