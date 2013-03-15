# ALA's version of EE's CommentEditor

ExpressionEngine offers the ability to allow commenters to edit their own comments inline, but we wanted to customize it a bit.

The modifications:

1. We adjusted the JS so we could put the function in our external JS file, instead of directly in the page (it took a little sleuthing to figure out how to make the form submit securely)
2. Added more control over the animations that reveal and hide the elements
3. Added a confirmation dialogue for closing comments

The original script as provided by EllisLab can be found here:

https://github.com/EllisLab/CommentEditor

Big thanks to Derek Jones and the EllisLab team for helping us figure out some of the important fiddly bits.
