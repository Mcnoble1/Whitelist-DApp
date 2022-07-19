'reach 0.1';

export const main = Reach.App(() => {
  setOptions({ untrustworthyMaps: true });

  const A = Participant('Alice', {
    // Specify Alice's interact interface here
  });
  const B = Participant('Bob', {
    // Specify Bob's interact interface here
  });
  const C = Participant('Festus', { 
    // Specify Charlie's interact interface here
  });
  init();
  // The first one to publish deploys the contract
  A.publish();
  const Whitelist = new Map(Address, UInt);
  Whitelist[this] = 26;
  commit();
  // The second one to publish always attaches
  B.publish();
  commit();

  // The third one to publish always attaches
  C.publish();
  commit();
  // write your program here
  exit();
});





