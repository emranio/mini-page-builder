now each block has inline styles in view.js based on it's settings.js. instead of this, create a seperate style.js in every block, then put the dynamic css there.
add an unique id to all block's warper. based on that id, create css from style.js and put that in style tag just before the block render.

move all inline styles into style.js for each block.


no need to make the id such #flexbox-block-ID
keep it simple like #xyz-block-ID

also try to remove too nested divs. keep it simple.

move the <StyleInjector id={blockId} css={dynamicCSS} />. and inject the css into <head>

and the css related common logic into the baseblock. just like we registed the view and settings component into the index.js, we will register the style component there