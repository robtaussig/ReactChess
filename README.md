# ReactChess

[Live version](http://www.robtaussig.com/ReactChess)

![board]

Play the classic game of Chess through your browser or mobile screen!

## Features

- Implements React Drag and Drop with an HTML5 or Touch Backend, depending on the client's machine.

![game]

- Dedicated Web Workers are used to keep the move processing on a separate thread from the UI, eliminating stuttering.

![workers]

- Fully functional, including pawn promotion, en passant, and castling.

- Written purely in JavaScript and React.js, with the web workers created and communicated with through the Flux cycle.

[board]: ./docs/board.png
[game]: ./docs/moves.gif
[workers]: ./docs/workers.png
