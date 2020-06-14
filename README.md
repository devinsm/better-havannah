# (Better) Havannah

The board game Havannah brought to the browser. The live version is available at
[havannahgame.com](https://havannahgame.com).

## Project Goals

I created this project to grow as a frontend web developer. As such, I wanted
the game to:

- Be Accessible

  > People with physical or visual impairments should be able to play the game.
  > That means the game needs to be fully keyboard accessible. It also means the
  > game must be usable via screen readers such as Apple's VoiceOver.

- Look Good (or at the very least, not look bad )

  > Aesthetics is an important part of a successful product. Even if all the
  > functionality is there, people are turned off by ugly software.

- Be Highly Usable

  > When I started this project I had just read
  > [Don't Make Me Think, Revisited](https://www.amazon.com/Dont-Make-Think-Revisited-Usability-ebook/dp/B00HJUBRPG)
  > by Steve Krug. I wanted to apply what I had learned while making this site.
  > Although this site is very simple, it's surprisingly easy to get little
  > things wrong.

- Be Maintainable and Robust
  > Modern software needs to be easy to maintain and easy to build upon. My goal
  > was to write robust code that could be modified with ease and confidence.

Although nothing is perfect, I'm confidant I achieved the above goals. An
explanation of how each goal was achieved is presented in the sections below.

## Accessibility

Each interactive widget on the page is keyboard accessible. I achieved this in
two ways. First, I used [Material-UI](https://material-ui.com/) components where
possible. Material-UI does a great job of making it's widgets keyboard
accessible, so when you use a Material-UI component you get keyboard
accessibility more or less for free.

The only major part of the site I couldn't use Material-UI components for was
the game board. To make the game board accessible, I tried to model the
semantics and keyboard interaction off of the elements described in the
[WAI-ARIA Authoring Practices 1.1](https://www.w3.org/TR/wai-aria-practices-1.1/).
The WAI-ARIA guidelines of course don't describe how to make a keyboard
accessible game board, but they do offer a lot of guidance on how to make
interactive "composite" widgets. Here are some things I did to ensure the game
board was accessible:

- Per the WAI-ARIA guidelines, the game board is a single tab stop.

  > That means that once a keyboard user tabs to the game board, they only need
  > to hit tab (or shift tab) once to tab away. The tab key is NOT used to
  > navigate within the board.

- Once a keyboard user has focused on the board, they can navigate within it
  using keyboard shortcuts.

  > My first thought was to allow the user to navigate between the cells using
  > the arrow keys. However a single tile has up to 6 neighbors, and there are
  > only four arrow keys so that doesn't work. I chose to build off of the WASD
  > keyboard shortcuts familiar to many computer gamers. In addition to the
  > standard WASD keys, I added Q and E to the mix allowing the user to navigate
  > freely in any of the 6 possible directions.

- Each tile is a
  [toggle button](https://www.w3.org/TR/wai-aria-practices-1.1/#button).

  > A toggle button is a, "two-state button that can be either off (not pressed)
  > or on (pressed)". Out of all the standard ARIA widgets, those semantics
  > seemed to best match the board tiles. The board tiles can be pressed (i.e.
  > they are a button), and can either have a stone or not have a stone (i.e.
  > there are two states). It's admittedly not a perfect match since there are
  > two stone colors, and once pressed a tile can never be pressed again.
  > However the semantics are close enough that a user of a screen reader will
  > be able to understand what kinds of interaction are possible.

- It's easy to tell which tile has focus.
  > I used the same styling as the Material-UI widgets do to represent the
  > focused state. I did so using the Material-UI CSS in JS theme so that the
  > focus styling stays consistent with Material-UI even if Material-UI changes
  > its theme slightly.
- Each tile has an informative label.
  > I gave each tile a label which tells screen reader users where they are on
  > the board, whether there is a stone there, and what color the stone is if
  > there is a stone.

There were other little things, but those are the accessibility highlights.

## Aesthetics

I used Material-UI's CSS in JS theme everywhere, and when in doubt referenced
the Material Design standards. I used Berkshire Swash as the header font, and
Roboto as the body font. I felt those fonts played well together, and that the
Berkshire Swash headers gave the site a distinct look and feel.

## Usability

There's a lot to usability, so I'll try to just hit the high points:

- The user always knows the state of the game.
  > Has the game started yet? Whose turn is it? Who won? At a glace the user can
  > always quickly answer those kinds of questions with little conscious
  > thought. When the game has not started, a banner asks them to choose a board
  > size in order to start the game (so obviously the game has not started).
  > When the game is in progress, that banner is replaced by a banner announcing
  > the current player (so obviously the game has begun). When the game is
  > finished that same banner announces the winner (so obviously the game is
  > over).
- The user can easily figure out which stones belong to which player.
  > A legend next the game board shows which color goes with "Player One" and
  > which color goes with "Player Two". The colors can be distinguished even by
  > color blind users.
- When the game completes the user is immediately notified.
  > There is no chance that they miss the change in the banner for two reasons.
  > First, when the game completes confetti falls from the top of the screen.
  > That's immediately recognizable to sighted users as signifying the end of a
  > game. Second, for unsighted users the changes in the banner text are
  > announced in real time (this is achieved using the aria-live attribute).
- The game rules and keyboard shortcuts are contained in accordion boxes.
  > This uses progressive disclosure to hide lengthy blocks of text that many
  > users will not be interested in. Someone who already knows the rules of
  > Havannah, and is not a keyboard user, does not need to be distracted by
  > those elements. However users who don't know the rules, or users who are
  > keyboard users, can easily expand the accordion boxes to access the
  > information they need.

## Maintainability and Robustness

I used [MobX](https://mobx.js.org/README.html) to manage application state.
React's state management system doesn't scale well as applications become larger
and more complex. I love MobX's reactive style of state management, the ease
with witch you can use rich ES6 data structures and class instances, and how it
encourages using React's context API to inject dependencies.

I put all of the game logic (e.g. rules and game state) in the `GameController`
class. Any modification to the game rules, or how they are implemented therefore
only needs to changed in one place. For instance, if a backend is built for the
site, the frontend code can be updated with little modification by updating a
few methods of the `GameController` class.

I used React's context API to inject an instance of the `GameController` class
into the UI components. This both made the code cleaner (no need to pass the
same prop down through the whole component tree), and more testable. To swap the
real `GameController` instance out with a mock instance when testing, all I
needed to do was feed the mock in via the context.

For testing the UI, I used
[React Testing Library](https://testing-library.com/docs/react-testing-library/intro).
Unlike its competitors (e.g. Enzyme) it encourages a style of testing which more
closely mimics real user interaction. For instance, instead of testing for a
`div` with a particular `id`, you might end up testing for a form element with a
particular label. I wrote tests for all non-trivial pieces of logic, which gives
me the confidence to make changes without breaking things.

For styling, I used JSS which comes baked into Material-UI. It allowed me to
share core styles (i.e. a theme) between all the various parts of the site. This
means that to change the look of the site (e.g. colors, fonts, etc.), you only
have to modify a single JavaScript object. To see that in action, change from
the light to the dark mode on the live site.

I used TypeScript to statically type my code. I find static typing to greatly
improve readability of code, and also to catch a lot of those pesky "can't read
property foo of undefined" errors.

I used [Prettier](https://prettier.io/) to format the code, giving it a uniform
style. I used [ESLint](https://eslint.org/) as my linter, sine
[TSLint will be deprecated in the near future](https://medium.com/palantir/tslint-in-2019-1a144c2317a9).
I used [Husky](https://github.com/typicode/husky) and
[lint-staged](https://github.com/okonet/lint-staged) to compile, lint, and
format the code on every commit. That prevents developers from accidentally
committing code which does not compile or has linter errors. It also ensures
that even if a developer's text editor is not properly running Prettier, the
files will be formatted before being committed.

Those are the high points. Feel free to read through the code base to get a feel
for the code and how it all fits together.
