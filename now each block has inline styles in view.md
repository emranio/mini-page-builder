now each block has inline styles in view.js based on it's settings.js. instead of this, create a seperate style.js in every block, then put the dynamic css there.
add an unique id to all block's warper. based on that id, create css from style.js and put that in style tag just before the block render.

move all inline styles into style.js for each block.