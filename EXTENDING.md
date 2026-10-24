# Extending Cabin Fever

Plain HTML, CSS and JavaScript. No framework, no bundler, no npm. Open `index.html` and refresh to see changes.

## How the code is put together

The game draws everything on one 320×240 canvas. The canvas is scaled up to fit the window with nearest-neighbour scaling, which keeps the pixels crisp. Around it sits a touch control panel built from plain HTML buttons (`js/touch.js`). All art is drawn in code from rectangles; there are no image files.

The files in `js/` are classic scripts that share globals. That is on purpose: it keeps `file://` working without a server. The load order in `index.html` matters: helpers first, `main.js` last.

| File | What lives there |
| --- | --- |
| `core.js` | Constants, canvas, drawing helpers `R()` (rect), `disc()`, `ell()`, `mix()` (colour blend), `rng()` (seeded random) |
| `config.js` | **All gameplay numbers** (`CFG`). Start here for balancing. |
| `font.js` | 5×7 bitmap font. `txt()` and `txtO()` (outlined) draw text. |
| `content.js` | Zombie hot takes, reading quotes, rap lines |
| `sprites.js` | `drawHuman()` for player and zombie, palettes `PP` / `PZ`, HUD icons |
| `audio.js` | `SFX.*` sound effects and the music sequencer (`playStep`) |
| `scores.js` | High score table in `localStorage` |
| `level-cabin.js`, `level-clearing.js`, `level-forest.js`, `level-kontula.js` | One file per level: collision map, painting, animated parts |
| `enemies.js` | Level guests that chase you besides the zombies (bear, mushroom granny, spurgu, nisti): kinds in `FOES`, their moves and sprites |
| `levels.js` | `buildGeo()` builds all levels at boot; `LEVELS` lists their settings |
| `state.js` | `S` (whole game) and `L` (current level) state, `setupLevel()` |
| `physics.js` | Tile collision, line of sight, BFS flow field for zombie pathfinding |
| `update.js` | Per-frame logic: player, zombies, puke, items, magazines, rap, getting caught |
| `render-world.js` | Play screen: layers, entities, lighting, HUD, rap panel |
| `render-screens.js` | Title, intro, initials entry, Hall of Fame, end screens; `draw()` |
| `share.js` | Share card image + copy buttons |
| `input.js` | Keyboard handling and screen flow (`S.mode`) |
| `touch.js` | Touch play: layout + scaling (`layoutMobile()`), stick, buttons, menu buttons per screen, on-screen keyboard, rap prompter |
| `main.js` | Boot, frame loop |

**Screen flow (`S.mode`):** `title → intro → play ⇄ rap / pause → caught → intro …`. A level ends with `clear`, then the next `intro`, or `victory` after the last level. `gameover` and `victory` go to `entry` (initials) if the score qualifies, then `scores`.

## Common changes

**Balance the game.** Edit `js/config.js`. Night length per level is `night` in `LEVELS` (`js/levels.js`).

**Touch controls.** Every touch button is a `<button data-k="key">`: on press it calls `tapKey(key)`, which runs the same `onKey()` / `rapKey()` path a real key press does, so game rules never live in `touch.js`. The stick sets `tkeys` (held arrow keys) that `down()` reads alongside the keyboard. Menu buttons per screen are in `menuFor()`, keyboard layouts in `KB`. On-screen text that names a key goes through `KT('KEYBOARD TEXT','TOUCH TEXT')`, which picks the wording for the input used last.

**New zombie lines.** Add to `QUOTES` in `js/content.js`. Use only characters the font has: A–Z, Ä, Ö, Å, 0–9 and `. , ! ? ' - : / + ( ) & # * = _ " %`. Lower case is shown as upper case. Anything else renders as blank.

**New rap lines.** Add to `RAPS`. Use **lower-case letters and spaces only**, because the player types them exactly. Aim for 35–45 characters.

**New sound.** Add a function to `SFX` in `js/audio.js`, built from `tn()` (tone) and `nz()` (noise), and call it from game code.

**New pickup.** Spawn it in `updPlay()` (`js/update.js`) with `freeSpot()`, the way stashes and mics are spawned. Handle pickup in the same items loop, and draw it in the items section of `drawWorld()` (`js/render-world.js`).

## Adding a level

1. **Create `js/level-<name>.js`** with three things:
   - A 20×14 collision map. `#` is solid, `.` is floor. The exit must be the two `D` tiles at the bottom of columns 9–10; the escape check in `updPlay()` assumes it.
   - A paint function returning `{bg, fg}`: two 320×224 canvases made with `mk()`. Draw with `G = <that canvas context>` and the `R()` / `disc()` helpers.
   - A `dyn(dawn, layer)` function for animated parts (fire, door, torches). It is called every frame with `dawn` from 0 to 1, and `layer` is `'under'` (before characters) or `'over'` (after the foreground).
2. **Register it in `buildGeo()`** in `js/levels.js`. Copy an existing `GEO.push({...})`. `bgD` / `fgD` are optional daytime versions that cross-fade in at dawn. `dark` is how dark the night gets.
3. **Add a `LEVELS` entry** in the same position: `name`, `night` (seconds), `start` (player tile), five `zs` zombie spawn tiles, and the two `why` lines shown when you escape. Optional: `sub` (a line under the name on the intro screen), `cp:[x,y]` (pixel spot of the hidden checkpoint flag; put it right behind something on the `fg` layer) and waves: `waves` lists who arrives in each slot (`'Z'` = the next zombie, filled only if the zombie count is high enough, or a guest kind), `waveEvery` is the slot length in seconds and `guestAt` gives each guest's spawn tile. Without `waves`, all `S.zombies` zombies start on the map.
4. **Add its `<script>` tag** to `index.html`, before `levels.js`.
5. **Lights:** give the `GEO` entry `lightsAt(flicker)` (a list of `[x, y, radius]` that cut through the dark) and `warmAt()` (orange glows). Levels 1–2 still use the older `g.lights` branch in `drawWorld()`. `smoke:[x,y]` adds rising smoke.

## Adding a level guest

Guests live in `L.zs` next to the zombies with `k` set to their kind, so magazines, raps and getting caught work without extra code. In `js/enemies.js`, add a kind to `FOES`: `name` (intro screen), `spd`, `read` (how long a magazine holds them, x `CFG.readTime`), `act(z,dt)` (their own move; return `true` to stand still this frame), optional `move(z,sx,sy)` (bend the chase direction or speed), `draw(c,z,headbob)` and `voice()`. Add their lines to `FOEQ` in `js/content.js` (`say`, `read`, `vibe`, `caught`, `card`). Then add them to a level's `waves` and `guestAt`. Set `z.calm=true` while a guest should not catch you, and `noDawn:true` on a kind that should not speed up at dawn.

Tile positions in `start` and `zs` are in tiles, for example `[9.5, 11.6]`. The second number is the feet position, so keep it at about `.6` inside a free tile.

## Art conventions

- 16 px tiles, 1 px dark outline on everything, palettes kept to a few hand-picked colours per object (see the palette objects at the top of each level file).
- **Foreground trick:** tall things (trees, roofs, shelves) are painted on both `bg` and `fg`. The `fg` copy is clipped to above `tileRow * 16 + 4`. Characters standing behind an object get covered, and characters in front don't. Use the `{r: row, d: drawFn}` object lists in the level files and this works automatically.
- Characters are `drawHuman(ctx, x, y, dir, frame, palette, opts)`, where `(x, y)` is the feet. A new character type is mostly a new palette.

## Debugging

Everything is global, so you can poke the game from the browser console during play:

```js
L.time = L.d.night - 5        // jump to 5 seconds before sunrise
while(L.pending&&L.pending.length)arrive(L.pending.shift()) // bring in every wave now
S.cp = S.level                 // pretend you found this level's checkpoint
L.p.mags = 9; L.p.mic = true  // give yourself items
L.zs.forEach(z => z.read = 99) // freeze all zombies
S.level = 1; toIntro(false)    // jump to level 2
localStorage.removeItem('cabinfever.scores.v1') // reset high scores
```

If you change the shape of saved score records, bump the key in `js/scores.js` (`SKEY`) so old saves don't break the table.
