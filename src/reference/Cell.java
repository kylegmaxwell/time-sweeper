/*
 * Created on Dec 9, 2005
 */

/**
 * @author Kylu
 */
public class Cell {

    public static boolean DEBUG=false;
    //public boolean containsMine;
    private boolean flagged;
    private int flags;//number of flagged neighbors
    private boolean clicked;
    private int mines;//number of neighbors which contain mines
    public static final int MINE=-1;
    
    public Cell()
    {
        //containsMine=false;
        flagged=false;
        flags=0;
        clicked=false;
        mines=0;
    }

    public Cell(boolean mine)
    {
        if (mine)
            mines=MINE;
        else
            mines=0;
        flagged=false;
        flags=0;
        clicked=DEBUG;
    }
    public boolean getMine()
    { return mines==MINE; }
    public boolean getFlag()
    { return flagged; }
    public boolean getClick()
    { return clicked; }
    public int getNumFlags()
    {return flags; }
    
    //set number adjacent mines
    public void setNumMines(int num)
    {
        mines=num;
    }
    public void incNumMines()
    { mines++; }
    public void incNumFlags()
    { flags++; }
    public void decNumFlags()
    { flags--; }
    
    //add or remove a flag
    //return true when a flag is added
    public boolean flag()
    {
        if (clicked)
            return false;
        flagged=!flagged;
        return flagged;
    }
    //click on mine
    //return mine Value
    public int click()
    {
        if (!flagged)
            clicked=true;
        else
            return -999;//bad value (avoid(0=empty,-1=mine))
        return mines;
    }

   public int getNumMines() {
        return mines;
    }
    
}
