# biolink

A link-in-bio page for [Tyree](https://music.apple.com/us/artist/tyree/1028194367):
an animated background, links to streaming/social profiles, and a shuffled
player that loops 30-second Apple Music previews.

Live at <https://dartsac.github.io/biolink/> (GitHub Pages, deployed from `main`).

It's plain HTML/CSS/JS with no build step.

## Development

```sh
npm install
npm run dev    # live-reloading server at http://127.0.0.1:8080
npm run lint   # ESLint
npm test       # playlist unit tests (node:test)
```

## Project layout

| Path               | What it is                                                 |
| ------------------ | ---------------------------------------------------------- |
| `index.html`       | Page markup, links, and social-share metadata              |
| `css/style.css`    | All styles (`normalize.css` is a vendored reset)           |
| `js/main.js`       | Player wiring: play/pause, next, Media Session, background |
| `js/tracks.js`     | The list of preview tracks                                 |
| `js/playlist.js`   | Endless shuffle that never repeats a song back-to-back     |
| `artist/`          | Background video, poster, profile, and share images        |
| `icons/`           | Link icons and favicons                                    |

## Common edits

**Add or change a link:** edit the `<ul class="links">` list in `index.html`.
Icons are 20×20 SVGs in `icons/`; use `alt=""` since the link text describes them.

**Add a song:** open the track on music.apple.com, start the preview, and copy
the `<audio>` `src` from dev tools. Add an entry to `js/tracks.js` with the part
of the URL after `.../AudioPreview`. If every preview fails to load, the player
hides itself.

**Replace the background:** export a short, small clip (the current one is
320×180) and re-encode:

```sh
ffmpeg -i clip.mov -an -pix_fmt yuv420p -c:v libx264 -crf 26 -movflags +faststart artist/background.mp4
ffmpeg -i clip.mov -an -pix_fmt yuv420p -c:v libvpx-vp9 -crf 38 -b:v 0 artist/background.webm
ffmpeg -i clip.mov -frames:v 1 -q:v 3 artist/background-poster.jpg
```

**Replace the profile photo:** keep it small, since it's displayed at ≤224px:

```sh
magick photo.png -resize 480x480^ -gravity center -extent 480x480 -strip -quality 82 artist/profile.webp
magick photo.png -resize 480x480^ -gravity center -extent 480x480 -strip -quality 80 artist/profile.jpg
magick photo.png -resize 1200x630^ -gravity center -extent 1200x630 -strip -quality 80 artist/og-image.jpg
```
