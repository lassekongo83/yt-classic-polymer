# YouTube Classic Polymer
Browse YouTube like it's 2015.

**YouTube Classic Polymer** is an extension that restyles YouTube's polymer design to look more like the old design from around 2015.

This extension also blocks some network requests, such as: 
- Avatars on the main page
- Animated thumbnails

In addition to that, it also removes some new features from the site, such as:
- Miniplayer
- "Skeleton" styles. (The empty background elements you see when the page is loading.)

![Before and After](yt-screen.png?raw=true)
Before and after screenshot.

## How to install
(Not yet available in the extensions stores.)

### Chromium
1. Clone or download this repository.
2. If you got a zip file, unzip it.
3. Go to `chrome://extensions`
4. Click to check `Developer mode`.
5. Click `Load unpacked extension`.
6. In the file selector dialog:
    - Select the directory `yt-classic-polymer` that was cloned/unzipped.
    - Click *Open*.

### Firefox
Not yet available. (Unless you run a version of Firefox that allows you to install unsigned extensions.)

An alternative is to copy the content of the [CSS file](https://github.com/lassekongo83/yt-classic-polymer/blob/master/src/inject/inject.min.css) and paste it into a UserStyle manager extension of your choice.
The network requests, like animated thumbnails etc won't be blocked, but you can block it with [uBlock Origin](https://github.com/gorhill/uBlock) by adding these filters to `My Filters`: 
```
||yt3.ggpht.com/a-/$image,domain=youtube.com
||i.ytimg.com/an_webp/$domain=youtube.com
```