# Cabin Fever

As the epic trip to Vierumäki was postponed due to norovirus, made this game instead :)

An 8-bit top-down survival game. A puking zombie with strong opinions chases you around a cabin. Survive until 6:00 AM, then escape. Four levels.

## Levels

| # | Level | Night | Who chases you |
| --- | --- | --- | --- |
| 1 | The cabin | 70 s | Zombies |
| 2 | The clearing | 90 s | Zombies |
| 3 | The deep forest, somewhere in Finland | 110 s | Arriving through the night: the **mushroom granny** and a zombie, then a zombie, then the **bear**, then the rest of the zombies |
| 4 | Kontula, East Helsinki | 130 s | Arriving through the night: a zombie and the **spurgu**, then two zombies, then the **nisti**, then the rest of the zombies |

The night (12:00 to 6:00 AM) passes fastest on level 1 and a little slower on each level after it. On levels 3 and 4 a new arrival comes every 15–16 seconds; a zombie slot only fills if your zombie count has that many zombies, so the fewer times you have been caught, the emptier the night.

- **Bear:** growls, then charges in a straight line and needs a breather.
- **Mushroom granny:** a fast nordic walker who stops to pick chanterelles.
- **Spurgu:** very slow; wobbles, naps on the spot (harmless while asleep) and spills slippery beer.
- **Nisti:** really fast, faster than you while dashing, but twitches in place between dashes and drifts off now and then.

### Checkpoints

Every level hides a checkpoint flag behind something tall (a bookshelf, a tree, a birch). Walk behind it to pick the flag up; a faint twinkle gives the spot away. If you then lose every life, the game over screen lets you retry the level of the last flag you found, with fresh lives and the score you had when you started that level, or give up and save your score. A used flag is back in its hiding place for the next try.

Magazines and raps work on everyone. The bear eats the magazine instead of reading it, the granny reads for longer, and the nisti loses interest fast.

## Play

- **Online:** GitHub Pages (Settings → Pages → deploy from `main`, root folder).
- **Locally:** open `index.html` in a browser. No build step, no server needed.

## Controls

| Key | Touch | Action |
| --- | --- | --- |
| Arrows / WASD | Drag the stick | Move |
| Space | THROW | Throw an art or dance magazine (zombies stop to read) |
| R | RAP | Rap, if you've found a mic (type the line before time runs out) |
| P / Esc | Pause button | Pause |
| R (while paused) | RESTART (pause menu) | Restart the game from level 1 |
| M | Speaker button | Sound on/off |
| Enter | Yellow button, or tap the screen | Start / continue |

### On a phone or tablet

Portrait puts the controls under the game screen; landscape puts the stick on the left and the buttons on the right. The stick appears wherever your thumb lands. The full screen button (where the browser allows it) trims the margins so the game screen grows. Raps and high score initials use one full-width on-screen keyboard in both orientations, with the line to type shown at double size right above it and the next key lit up (`touchRapHint` in `js/config.js`). On the title screen, swipe the game screen to flip pages. Rap lines get 80% more time when typed by touch (`touchRapSlack` in `js/config.js`); a hardware keyboard keeps the original timing.

On desktop, rapping keeps the game screen at its normal size, with the on-screen keyboard overlaid at the bottom and the original rap panel above it. Pausing the game also pauses the music, which continues when you resume. On-screen hints switch between key names and button names depending on what you last used.

Get caught and you turn into a zombie: the level restarts with one more zombie. Five and it's game over.

## Project layout

```
index.html      page + script load order
css/style.css   page and touch control styles (the game itself draws on a canvas)
js/             game code, one topic per file
```

Want to change or add something? See [EXTENDING.md](EXTENDING.md).
