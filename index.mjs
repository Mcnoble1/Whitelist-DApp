import {loadStdlib} from '@reach-sh/stdlib';
import { clear } from 'console';
import * as backend from './build/index.main.mjs';

const amt = 50;

console.log('Deploying / attaching notifications');

const stdlib = loadStdlib(process.env);
console.log(`The consensus network is ${stdlib.connector}.`);

const startingBalance = stdlib.parseCurrency(100);
const fmt = (x) => stdlib.formatCurrency(x, 4);
const getBalance = async (who) => fmt(await stdlib.balanceOf(who));

const [ accAlice, accBob, accFestus ] =
  await stdlib.newTestAccounts(3, startingBalance);

const addrs = {
  'Alice': accAlice.getAddress(),
  'Bob': accBob.getAddress(),
};
console.log(`Alice Whitelist address: ${addrs['Alice']}`);
console.log(`Bob Whitelist address: ${addrs['Bob']}`);

const beforeAlice = await getBalance(accAlice);
const beforeBob = await getBalance(accBob);
console.log(`Alice has ${beforeAlice}`);
console.log(`Bob has ${beforeBob}`);

accAlice.setDebugLabel('Alice');
accBob.setDebugLabel('Bob');

const token = await stdlib.launchToken(accAlice, "Zorkmid", "ZMD");

if ( stdlib.connector === 'ETH' || stdlib.connector === 'CFX' ) {
  const myGasLimit = 5000000;
  accAlice.setGasLimit(myGasLimit);
  accBob.setGasLimit(myGasLimit);
} else if ( stdlib.connector == 'ALGO' ) {
  console.log(`Demonstrating need to opt-in on ALGO`);
  await token.mint(accAlice, startingBalance);
  console.log(`Opt-ing in on ALGO`);
  await accAlice.tokenAccept(token.id);
  await accBob.tokenAccept(token.id);
}

await token.mint(accAlice, startingBalance.mul(2));
await token.mint(accBob, startingBalance.mul(2));

console.log(`Alice transfers to Bob honestly`);
await stdlib.transfer(accAlice, accBob, amt, token.id);


const ctcAlice = accAlice.contract(backend);
const ctcBob = accBob.contract(backend, ctcAlice.getInfo());



await Promise.all([
  backend.Alice(ctcAlice, {
    ...stdlib.hasRandom,
    // implement Alice's interact object here
  }),
  backend.Bob(ctcBob, {
    ...stdlib.hasRandom,
    // implement Bob's interact object here
  }),
]);







// import { loadStdlib } from '@reach-sh/stdlib';
// import * as backend from './build/index.main.mjs';
// import * as fs from 'fs';

// const failingMethod = 2;

// const stdlib = loadStdlib(process.env);
// const pc = stdlib.parseCurrency;
// const b = pc(100);
// const balOf = async (acc, tok) => stdlib.balanceOf(acc, tok);
// const amt = pc(20);

// const accAlice = await stdlib.newTestAccount(b);
// const ctcA = accAlice.contract(backend);

// const algo = async () => {
//   const token = await stdlib.launchToken(accAlice, "Zorkmid", "ZMD");
//   console.log(`Launched token:`, token.id.toString());

//   const tokenId = token.id.toNumber();

//   const checkBal = async (addr, idx) => {
//     const address = stdlib.formatAddress(addr);
//     const bal = await balOf(address, tokenId);
//     const expectedBal = {
//         0: amt,
//         1: pc(0),
//       }[idx];
//     stdlib.assert(bal.eq(expectedBal), `Expected correct balance: ${bal} == ${expectedBal}`);
//     console.log(`Balance:`, bal.toString());
//   }
// }

// if (stdlib.connector == 'ALGO') {
//   await algo();
// } else {
//   console.log('Invalid address: This test is only for ALGO');
// }