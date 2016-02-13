import javax.swing.*;

import java.awt.event.*;
import java.awt.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class TimeSweeper extends JApplet implements ActionListener
{
	public JMenuItem view, refresh, newGame;
	public JRadioButtonMenuItem easy, medium, difficult, custom;
	public JLabel time, mines;
	private JButton button1;
	private KPanel panel;
	private Timer timer; 
	private int t,m;//current time and num mines
	private Sweeper game;
	private int [][] stat = {{9,9,10,20},{16,16,40,20},{16,30,99,20},{16,30,1,20}};
	private int statIndex;//index of current game difficulty
	
	public TimeSweeper()
	{
		super();
		addMouseListener(new Clicker());
		Container c = getContentPane();
		c.setLayout(new BorderLayout());
		
		JPanel s = new JPanel(new FlowLayout());
		c.add(s,BorderLayout.SOUTH);
		panel = new KPanel();
		c.add(panel,BorderLayout.CENTER);
		mines = new JLabel("00");
		mines.setForeground(Color.RED);
		s.add(mines);
		button1 = new JButton("Reset");
		button1.addActionListener(new ButtonListener());
		s.add(button1);
		time=new JLabel("00");
		time.setForeground(Color.BLUE);
		s.add(time);
		
		JMenuBar bar = new JMenuBar();
		JMenu m = new JMenu("File");
		bar.add(m);
		
		newGame = new JMenuItem("New Game",KeyEvent.VK_V);
		newGame.addActionListener(new MenuListener());
		m.add(newGame);
		refresh = new JMenuItem("Refresh");
		refresh.addActionListener(new MenuListener());
		m.add(refresh);
		
		//m.addSeparator();
		m = new JMenu("Difficulty");
		bar.add(m);
		ButtonGroup group = new ButtonGroup();
		easy = new JRadioButtonMenuItem("Easy");
		easy.addActionListener(new MenuListener());
		group.add(easy);
		m.add(easy);
		medium = new JRadioButtonMenuItem("Medium");
		medium.addActionListener(new MenuListener());
		group.add(medium);
		m.add(medium);
		difficult = new JRadioButtonMenuItem("Difficult");
		difficult.addActionListener(new MenuListener());
		group.add(difficult);
		m.add(difficult);
		custom = new JRadioButtonMenuItem("Custom");
		custom.addActionListener(new MenuListener());
		group.add(custom);
		m.add(custom);
		
		this.setJMenuBar(bar);
		
		setVisible(true);
	}
	
	public void init()
	{
//		row,col,mine,dim
	    difficult.setSelected(true);
	    statIndex=2;
	    timer = new Timer(1000,this);
	    makeGame();
		this.setSize(650,450);
	}
	private void makeGame()
	{
	    int i = statIndex;
	    game = new Sweeper(stat[i][0],stat[i][1],stat[i][2],stat[i][3]);
	    t=0;
	    m=stat[i][2];
	    time.setText(Integer.toString(t));
	    mines.setText(Integer.toString(m));
	}
	public void actionPerformed(ActionEvent e)
	{
	    t++;
	    time.setText(Integer.toString(t));
	    repaint();
	}
	private class KPanel extends JPanel
	{
		public KPanel()
		{
			super();
		}
		public void paint(Graphics g)
		{
		    g.setColor(Color.LIGHT_GRAY);
		    g.fillRect(0,0,getWidth(),getHeight());
			game.paint(g);
		    /*g.setColor(Color.BLACK);
		    for (int i=0;i<100000;i++)
		    {
		        int x = (int)(Sweeper.rnd.nextDouble()*400);
		        int y = (int)(Sweeper.rnd.nextDouble()*400);
		        g.fillRect(x,y,1,1);
		    }*/
		}
	}

	private class ButtonListener implements ActionListener
	{
		public void actionPerformed(ActionEvent e)
		{
			//JOptionPane.showMessageDialog(null,text.getText());
		    //if (game.getGameOver())
		    makeGame();
			panel.requestFocus();
			repaint();
		}
	}
	private class MenuListener implements ActionListener
	{
		public void actionPerformed(ActionEvent e)
		{
		    if (e.getSource()==refresh)
		    {
		        repaint();
		    }
		    else if (e.getSource()==newGame)
		    {
		        makeGame();
		    }
		    else if (e.getSource()==easy)
		    {
		        statIndex=0;
		        makeGame();
		    }
		    else if (e.getSource()==medium)
		    {
		        statIndex=1;
		        makeGame();
		    }
		    else if (e.getSource()==difficult)
		    {
		        statIndex=2;
		        makeGame();
		    }
		    else if (e.getSource()==custom)
		    {
		        statIndex=3;
		        makeGame();
		    }
			panel.requestFocus();
			repaint();
		}
	}
	private class Clicker extends MouseAdapter
	{
	    //mouseClicked
	    //mouseReleased
	    //mousePressed
	    boolean left, right;
	    public static final int l = MouseEvent.BUTTON1, r = MouseEvent.BUTTON3; 
	    public Clicker()
	    {
	        left=false;
	        right=false;
	    }
	    public void mousePressed(MouseEvent e)
	    {
	        if (e.getButton()==l)
	            left=true;
	        if (e.getButton()==r)
	            right=true;
	    }
	    
	    public void mouseReleased(MouseEvent e)
		{
	        int state=-1;
	        int b = e.getButton();
	        
	        if (b==l && !right)
	            state=Sweeper.LEFT;
	        if (b==r && !left)
	            state=Sweeper.RIGHT;
	        if (b==l && right  || b==r && left)
	        {
	            //JOptionPane.showMessageDialog(null,"both");
	            state=Sweeper.BOTH;
	        }
	        if (e.isControlDown())
	            state=5;
	        try
		    {
	            if (!timer.isRunning())
		            timer.start();
				if (game.click(state,e.getX(),e.getY()))
				{
				    timer.stop();
				    repaint();
				    if (game.getVictory())
				        JOptionPane.showMessageDialog(null,"You Won! in "+t+" seconds.");
				}
				panel.requestFocus();
				repaint();
		    }
		    catch (ArrayIndexOutOfBoundsException ex)
		    {}
		    if (b==l)
		        left=false;
		    if (b==r)
		        right=false;
		    mines.setText(Integer.toString(game.getM()));
		    repaint();
		}
	}
}
