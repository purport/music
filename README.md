# Music

A spotify clone (maybe).

Actions:
 - CRUD Playlist (adds to library)
 - Heart stuff (adds to library in a playlist)
 - 

Types:
 - Tracklist (Playlist Album Compilation Single EP)
   - Track
 - Artist
   - Popular
   - Discography
 - Podcast
   - Episode

 - Audiobook
   - Chapter

 - Profile
   - Taste
 - History


Access patterns:
  - artist, tracklist, 

PK    SK            Props
A#abc A#abc         {metadata}
A#abc A#abc#P       {metadata}
A#abc A#abc#D#00001 {metadata}

PK          SK                 Props


Album#turbo Metadata           {title:"Turbo"}
Album#turbo Collab#cory-wong   {name:"Cory Wong"}
Album#turbo Artist#dirty-loops {name:"Dirty Loops"}
Album#turbo Track#000001       {title:"Follow the light",duration:"4:03"}
    

User
Artist
Disc
Track
Playlist

User interactions
Create Playlist
Add/Remove Track in Playlist
Like Disc
Like Track
Follow Playlist
Follow Artist
Get Artist, Discs, Tracks
Get Disc, Tracks
Get Playlist, Tracks

Entity    PK                 SK
Artist    Artist#<Number>    Artist#<Number>
Disc      Artist#<Number>    Disc#<yyyy-mm-dd>|<Number>
Track     Artist#<Number>    Disc#<yyyy-mm-dd>|<Number>#Track#<Number>
Playlist  Playlist#<Number>  Playlist#<Number>


Album#1 Collab#1           artist name 1  Artist#1
Album#1 Collab#2           artist name 2  Artist#2
Album#1 Track#1Features#1  artist name 2  Artist#2
