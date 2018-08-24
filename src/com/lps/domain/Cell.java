package com.lps.domain;

import com.lps.exception.CellStrMismatchException;

public abstract class Cell implements Comparable<Cell> {
	static final int TIME_INTERVAL = 40;
	protected String text;
	protected int y;
	protected int height;
	
	public Cell(String text, int y, int height) {
		this.text = text;
		this.y = y;
		this.height = height;
	}

	@Override
	public int compareTo(Cell c) {
		return this.y - c.y;
	}
	
	public abstract int getStartTime();
	public abstract int getEndTime();
	// get the phrase for cell in initialization graph
	public abstract String getInitPhrase() throws CellStrMismatchException;
	// get the phrase for cell in reactive rule or macroaction graph
	public abstract String getPhrase() throws CellStrMismatchException;

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public int getY() {
		return y;
	}

	public void setY(int y) {
		this.y = y;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

}
