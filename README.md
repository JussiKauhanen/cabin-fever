# Cabin Fever

As the epic trip to Vierumäki was postponed due to norovirus, made this game instead :)

An 8-bit top-down survival game. A puking zombie with strong opinions chases you around a cabin. Survive until 6:00 AM, then escape. Two levels.

## Play

- **Online:** GitHub Pages (Settings → Pages → deploy from `main`, root folder).
- **Locally:** open `index.html` in a browser. No build step, no server needed.

## Controls

| Key | Action |
| --- | --- |
| Arrows / WASD | Move |
| Space | Throw an art or dance magazine (zombies stop to read) |
| R | Rap, if you've found a mic (type the line before time runs out) |
| P / Esc | Pause |
| M | Sound on/off |

Get caught and you turn into a zombie: the level restarts with one more zombie. Five and it's game over.

## Project layout

```
index.html      page + script load order
css/style.css   page styles (the game itself draws on a canvas)
js/             game code, one topic per file
```

Want to change or add something? See [EXTENDING.md](EXTENDING.md).
