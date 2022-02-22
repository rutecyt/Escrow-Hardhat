import { ethers } from 'ethers';
import deploy from './deploy';
import addContract from './addContract';
import renderContracts from './renderContracts';
import './index.scss';

let contracts = 0;
async function newContract() {
  const beneficiary = document.getElementById('beneficiary').value;
  const arbiter = document.getElementById('arbiter').value;
  const value = ethers.utils.parseEther(document.getElementById('ether').value);
  const contract = await deploy(arbiter, beneficiary, value);
  await contract.deployed();
  let deployedTrxs = JSON.parse(localStorage.getItem('deployedTrxs')) || [];
  deployedTrxs.push(contract.address);
  localStorage.setItem('deployedTrxs', JSON.stringify(deployedTrxs));
  addContract(++contracts, contract, arbiter, beneficiary, value);
}

let storedContracts = localStorage.getItem('deployedTrxs');
renderContracts(storedContracts);

document.getElementById('deploy').addEventListener('click', newContract);
