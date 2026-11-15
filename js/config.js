"use strict";
/* Tunables. Change numbers here; nothing else needs to move. Times are seconds, speeds px/second. */
const CFG={
  startLevel:1,             // new games and restarts begin at the cabin
  playerSpeed:64,           // normal walking speed
  zombieSpeed:38,           // base zombie speed (each extra zombie gets +1.5)
  zombieSpeedupAtDawn:.25,  // zombies get up to 25% faster as night ends
  pukeEvery:[4.5,8.5],      // random gap between pukes, min/max
  puddleLife:15,            // how long puke stays on the floor
  slipTime:.75,             // stumble time after stepping into puke
  grannyTurnTime:2,         // warning time between a zombie bite and the picker turning
  grannyIntroTime:5.5,      // extra time to read the forest's protect-the-picker instructions
  grannySafeBonus:750,      // keep the mushroom picker unbitten until sunrise
  mushroomEvery:3.5,        // time between an infected picker's mushroom throws
  mushroomSpeed:88, mushroomLife:1.6, // thrown mushrooms cause a slip, not a lost life
  mushroomBitsLife:3,       // small slippery mushroom pieces disappear after a few seconds
  trainFirst:7, trainEvery:[8,12], // metro platform: first train, then a random gap between trains
  trainWarn:2.6, trainSpeed:300,   // bell and edge lights before a train, then it rushes through
  trainReturn:10,           // a zombie hit by a train climbs back out of the tunnel after this long
  trainHitPoints:200,
  inspectorFineMoney:20,    // the inspector's fine in euros...
  inspectorFine:2, inspectorFinePoints:100, inspectorCooldown:7, // ...or mags if you cannot pay (points if you have none), then a break
  inspectorDizzy:3.5,       // a train only grazes the inspector: he lands on the platform, dizzy for this long
  announceEvery:15,         // time between platform announcements
  readTime:6,               // how long a zombie reads a magazine
  magsStart:1, magsMax:9, magsPerStash:2,
  stashEvery:10,            // a new magazine stash spawns this often (max 2 on the map)
  micEvery:30,              // cooldown before a new mic can appear
  rapBaseTime:2.4, rapTimePerChar:.26, // time limit per rap line = base + perChar * length (gets 7% tighter per line)
  vibeBase:3, vibePerLine:4, // headbob time after a rap = base + perLine * lines completed
  escapeBonus:1000,         // x level number x zombie count
  maxZombies:5,             // getting caught with this many on the map = game over
  // money: coins on the floor, who pays and who takes, and the kiosk's prices (js/economy.js)
  coinFirst:5, coinEvery:7, coinMax:3, coinValue:5, moneyMax:999,
  magSellPrice:4, magSellCooldown:4, // a healthy mushroom granny buys a magazine you throw to her; keep two of them below prices.mags so the kiosk cannot be milked
  pillSellPrice:25, nistiHigh:8,     // the nisti buys a magic pill instead of catching you, then drifts off for a while
  nistiSteal:20, nistiFlee:4,        // no pill? he picks your pocket and runs. Only a broke player gets caught.
  teekkariGift:5,                    // what a generous teekkari hands you
  prices:{mags:10,mic:20,pill:35,freeze:25,ff:30,reset:60},
  freezeTime:6,                      // DEEP FREEZE: no enemy moves
  ffTime:8, ffRate:3,                // FAST FORWARD: the night clock runs this many times faster
  // magic pill (the matrix effect): enemies slow down and the clock speeds up. Much rarer than magazines.
  pillFirst:28, pillEvery:45, pillMax:3, pillTime:7, pillSlow:.3, pillRate:2.5,
  // Espoo: the startup founder appears, sprints at you and is gone again
  startupSpeed:92, startupPitch:.8, startupRun:2.8, startupAway:[6,9], startupNear:64,
  // the office: the manager's meeting invites root you to the spot; HR shows up rarely and ends the game on contact
  inviteEvery:4.5, inviteSpeed:95, inviteLife:1.8, meetingTime:1.6, meetingCooldown:3,
  hrFirst:35, hrEvery:[32,46], hrWarn:3, hrStay:7, hrSpeed:50,
  touchRapSlack:1.8,        // mobile: rap time limit x this when typed on the touch keyboard (thumbs are slower than ten fingers)
  touchRapHint:true         // mobile: light up the next key to press on the touch keyboard
};
const MAXZ=CFG.maxZombies;
