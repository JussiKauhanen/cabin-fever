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
  readTime:6,               // how long a zombie reads a magazine
  magsStart:1, magsMax:9, magsPerStash:2,
  stashEvery:10,            // a new magazine stash spawns this often (max 2 on the map)
  micEvery:30,              // cooldown before a new mic can appear
  rapBaseTime:2.4, rapTimePerChar:.26, // time limit per rap line = base + perChar * length (gets 7% tighter per line)
  vibeBase:3, vibePerLine:4, // headbob time after a rap = base + perLine * lines completed
  escapeBonus:1000,         // x level number x zombie count
  maxZombies:5,             // getting caught with this many on the map = game over
  touchRapSlack:1.8,        // mobile: rap time limit x this when typed on the touch keyboard (thumbs are slower than ten fingers)
  touchRapHint:true         // mobile: light up the next key to press on the touch keyboard
};
const MAXZ=CFG.maxZombies;
