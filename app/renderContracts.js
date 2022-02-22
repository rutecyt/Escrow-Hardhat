import { ethers } from 'ethers';

import abi from './artifacts/contracts/Escrow.sol/Escrow.json';

export default async function renderContracts(contracts) {
  JSON.parse(contracts).forEach(async (address) => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const contract = new ethers.Contract(address, abi.abi, provider);
    const arbiter = await contract.arbiter();
    const beneficiary = await contract.beneficiary();
    const value = ethers.utils.formatEther(await provider.getBalance(address));

    const buttonId = `approve-${address}`;

    const container = document.getElementById('container');
    container.innerHTML += createHTML(buttonId, arbiter, beneficiary, value);

    contract.on('Approved', () => {
      document.getElementById(buttonId).className = 'complete';
      document.getElementById(buttonId).innerText = "✓ It's been approved!";
    });

    if (await contract.isApproved()) {
      document.getElementById(buttonId).className = 'complete';
      document.getElementById(buttonId).innerText = "✓ It's been approved!";
    }

    document.getElementById(buttonId).addEventListener('click', async () => {
      const signer = provider.getSigner();
      await contract.connect(signer).approve();
    });

    function createHTML(buttonId, arbiter, beneficiary, value) {
      return `
      <div class="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> ${arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> ${beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> ${value} ether</div>
        </li>
        <div class="button" id="${buttonId}">
          Approve
        </div>
      </ul>
    </div>
    `;
    }
  });
}
