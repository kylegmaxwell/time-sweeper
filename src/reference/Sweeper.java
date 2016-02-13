/*
 * Created on Dec 9, 2005
 */

/**
 * @author Kylu
 */

import java.awt.*;
import java.awt.event.*;
import java.util.Random;

import javax.swing.JOptionPane;
//import javax.swing.*;

public class Sweeper {

    private Cell [][] grid;
    private int dim;//dimension of cells
    private int rows, cols;
    private int time;
    public static Random rnd = new Random();
    public static final int shuffles=7;
    public int mines,m;
    public Color [] colors;
            //{Color.BLUE,Color.GREEN,Color.RED,Color.MAGENTA,Color.CYAN,Color.YELLOW,Color.ORANGE,Color.PINK };
    public static final int LEFT=0,RIGHT=1,BOTH=2;
    private boolean gameIsOver,victory;
    
    public Sweeper(int numRows, int numCols, int numMines, int cellDimension)
    {
        gameIsOver=false;
        victory=false;
        colors = new Color[8];
        for (int i=0;i<8;i++)
           colors[i]=new Color(((i+4)%6)*50,((i+2)%5)*50,((i+3)%4)*50);
        m=mines=numMines;
        time=0;
        dim=cellDimension;
        rows=numRows;
        cols=numCols;
        boolean [][] b = getMines();
       grid = new Cell[rows][cols];
        
        for (int r=0;r<rows;r++)
            for (int c=0;c<cols;c++)
            {
                grid[r][c]=new Cell(b[r][c]);
            }
        
        //!!!!!!!!!!!!!!!EXTREMELY INEFFICIENT (sorta)
        for (int r=0;r<rows;r++)
            for (int c=0;c<cols;c++)
            if (b[r][c])
            {
                grid[r][c]=new Cell(b[r][c]);
	            Cell cell=null;
	            for (int i=-1;i<2;i++)
	                for (int j=-1;j<2;j++)
	                {
	                try
	                {
	                cell=grid[r+i][c+j];
	                if (!cell.getMine())
	                    cell.incNumMines();
	                }
	                catch (ArrayIndexOutOfBoundsException ex)
	                { }
	                }
            }
    }
    public int getM()
    { return m; }
    public boolean getGameOver()
    {
        return gameIsOver;
    }
    public boolean[][] getMines()
    {
        int mines = this.mines;
        boolean [][] b=new boolean[rows][cols];
        for (int r=0;r<rows;r++)
            for (int c=0;c<cols;c++)
            {
                if (mines>0)
                {
                    mines--;
                    b[r][c]=true;
                }
                else
                    b[r][c]=false;
            }
        for (int i=0;i<shuffles;i++)
            shuffle(b);
        return b;
    }
    
    //use Ms. Teukolsky's Friend's Shuffle algorithm
    //swap each element with a random element
    //(this is ment to be repeated more than once to achieve a good shuffle
    public void shuffle(boolean [][] arr)
    {
        boolean temp, i, j;
        int rr, cc;
        //swap each element with a random element
        for (int r=0;r<rows;r++)
            for (int c=0;c<cols;c++)
            {
                temp=arr[r][c];
                rr = rnd.nextInt(rows);
                cc = rnd.nextInt(cols);
                arr[r][c]=arr[rr][cc];
                arr[rr][cc]=temp;
            }
    }
    public void paint(Graphics g)
    {
        Color prev = g.getColor();
        paintRegular(g);
        if (gameIsOver)
            drawMines(g);
        g.setColor(prev);//restore old color
    }
    private void drawMines(Graphics g)
    {
        int x=0, y=0;
        g.setColor(Color.BLACK);
        for (int r=0;r<rows;r++)
        {
            y+=dim;
            x=0;
            for (int c=0;c<cols;c++)
            {
                x+=dim;
                if (grid[r][c].getMine())
                	g.fillOval(x+1,y+1,dim-1,dim-1);
            }
        }
    }
    private void paintRegular(Graphics g)
    {
        int x=0, y=0;
        for (int r=0;r<rows;r++)
        {
            y+=dim;
            x=0;
            for (int c=0;c<cols;c++)
            {
                x+=dim;
                g.setColor(Color.GRAY);
                
                //square has been clicked on
                if (grid[r][c].getClick())
                {
                    //draw blank
                    g.setColor(Color.LIGHT_GRAY);
                    g.fillRect(x,y,dim,dim);

                    g.setColor(Color.black);
                    g.setFont(new Font("Arial",0,dim-1));
                    if (grid[r][c].getMine())
                    {
                        g.fillOval(x+1,y+1,dim-1,dim-1);
                        g.setColor(Color.red);
                        g.drawLine(x,y,x+dim,y+dim);
                        g.drawLine(x,y+dim,x+dim,y);
                    }
                    else
                    {
                        int zero = grid[r][c].getNumMines();
                        if (zero!=0)
                        {
                            g.setColor(colors[zero-1]);
                            g.drawString(Integer.toString(zero),x+1,y+dim-1);
                        }
                    }
                }
                else
                {
                    if (grid[r][c].getFlag())
                    {
	                    g.setColor(Color.RED);
	                    g.fillRect(x,y,dim,dim);
	                }
                    else
                    {
                        g.setColor(Color.GRAY);
                        g.fillRect(x,y,dim,dim);
                    }
                }
                
                
                //draw box outline
                g.setColor(Color.BLACK);
                g.drawRect(x,y,dim,dim);
            }
        }
    }

    public boolean click(int e, int x, int y)
    {
        if (getGameOver())
            return true;
        x-=dim;
        y-=(23+dim);
        x/=dim;
        y/=dim;
        Cell c = grid[y][x];
        //int b = e.getButton();
        if (e==5)
        {
            JOptionPane.showMessageDialog(null,c.getNumFlags()+","+c.getNumMines());
            return false;
        }
        if (e==BOTH)
        {
            if (c.getClick() && c.getNumFlags()==c.getNumMines())
            {
                for (int i=-1;i<2;i++)
                    for (int j=-1;j<2;j++)
                        try
                        {
                            if (click(grid[y+i][x+j],x+j,y+i))
                                return true;
        			    }
        			    catch (ArrayIndexOutOfBoundsException ex)
        			    {}
            }
        }
        else if(e==RIGHT)
        {
            boolean flag = c.flag();
            
            if (!c.getClick())
            {
                if (flag)
                    m--;
                else
                    m++;
                for (int i=-1;i<2;i++)
	                for (int j=-1;j<2;j++)
	                    try
	                    {
	                        if (flag)
	                            grid[y+i][x+j].incNumFlags();
	                        else
	                            grid[y+i][x+j].decNumFlags();
	    			    }
	    			    catch (ArrayIndexOutOfBoundsException ex)
	    			    {}
            }
        }
        else if (e==LEFT)
        {
            if (click(c,x,y))
                return true;
        }
        return win();
    }
    private boolean win()
    {
        //check for victory
        if (m==0)
        {
            for (int r=0;r<rows;r++)
                for (int c=0;c<cols;c++)
                    if (!grid[r][c].getClick() && !grid[r][c].getFlag())
                        return false;//might not be correct mine mapping
	        gameIsOver=true;
	        victory=true;
	        return true;
        }
        return false;
    }
    private boolean click(Cell c, int x, int y)
    {
        int click = c.click();
        if (click==Cell.MINE)
        {
            gameIsOver=true;
            return true;
        }
        if (click==0)
            clickHelp(x,y);
        return false;
    }
  
    private void clickHelp(int x, int y)
    {
        for (int i=-1;i<2;i++)
            for (int j=-1;j<2;j++)
                try
                {
                    if (!grid[y+i][x+j].getClick() && grid[y+i][x+j].click()==0)
                        clickHelp(x+j,y+i);
			    }
			    catch (ArrayIndexOutOfBoundsException ex)
			    {}
                    
    }
    public boolean getVictory() {
        return victory;
    }
}
