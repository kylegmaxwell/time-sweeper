'use strict';
/**
 * Simple binary tree node
 */
class Node {
    /**
     * Create a node object from given data.
     * A tree will be formed recursively if the data contains set left and right properties.
     * @param  {data} Object The structure of the tree
     */
    constructor(data) {

        this.left = null;
        if (data.left) {
            this.left = new Node(data.left);
        }

        this.right = null;
        if (data.right) {
            this.right = new Node(data.right);
        }
    }

    /**
     * Draw the node and it's children recursively.
     *
     * Assumes that ctx.beginPath() and ctx.fill() are called externally.
     * See http://www.html5rocks.com/en/tutorials/canvas/performance/#toc-batch
     *
     * @param  {ctx} The 2d context on which to draw
     * @param  {Number} x The horizontal draw position
     * @param  {Number} y The vertical draw position
     * @param  {Number} width The horizontal separation to prevent drawn nodes form overlapping
     */
    draw(ctx, x, y, width) {
        var rad = 5;

        // Call moveTo to update the cursor so a polygon is not created across circles
        ctx.moveTo(x,y);

        // Specify the arc to draw (it will actually be visible when fill is called)
        ctx.arc(x, y, rad, 0, 2*Math.PI);

        var height = 20;
        if (this.left) {
            this.left.draw(ctx, x-width, y+height, width/2)
        }
        if (this.right) {
            this.right.draw(ctx, x+width, y+height, width/2)
        }
    }
}