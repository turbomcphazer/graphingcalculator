A little graphing calculator:
- accepts a string in an HTML form
- checks whether the string has changed
- then converts it to reverse Polish notation via Dijkstra's shunting-yard algorithm
- (a thing I totally didn't need to look up)
- then runs through a range of values for x, subbing x into the string
- calculates the resulting value
- and adds it to a list
- which gets rendered onto a canvas

This correctly handles a number of functions, complex formulas, and zooming.
The styling could be more responsive and the rendering (of line and of zoom) could be smoother/animated.
Also, I could allow for multiple formulae, or formulae that don't start with "y = ".
But for what it is, it works!
