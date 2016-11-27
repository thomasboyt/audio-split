I wrote this script to split a Youtube album-length stream into multiple named and tagged MP3s, because what.cd is down and chaos reigns supreme and sometimes the only version of a record you can get is a 160kbps Youtube rip okay?

Usage:

```
# get an audio from youtube
youtube-dl -x https://www.youtube.com/watch?v=foobarbaz

# then split it using the data format below
node split.js --out output_path/ --data data.json audio.opus
```

Data file example:

```js
{
  "album": "Mignonne",
  "artist": "Taeko Ōnuki",
  "tracks": [
    {
      "title": "じゃじゃ馬娘 [Jajauma musume / Capricious Daughter]",
      "number": 1,
      // Number of seconds since the start of the audio file, not the duration!
      "seconds": 0
    },
    {
      "title": "横顔 [Yokogao / Profile]",
      "number": 2,
      "seconds": 278
    },
    // ...
  ]
}
```

Psst: it's pretty easy to write a transform script to generate a file like that if the album has a Youtube description with timestamps! regexpal.com is your friend.