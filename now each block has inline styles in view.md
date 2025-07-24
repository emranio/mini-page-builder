now each block has inline styles in view.js based on it's settings.js. instead of this, create a seperate style.js in every block, then put the dynamic css there.
add an unique id to all block's warper. based on that id, create css from style.js and put that in style tag just before the block render.

move all inline styles into style.js for each block.



in my whole code base, improve my code for best practices and best performance.
also convert the context to reducer.
use memo is good but do not overdo it, keep code clean small and simple.

keep original functionality intact. read whole codebase first to understand it further.