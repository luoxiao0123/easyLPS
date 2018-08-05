package com.lps.domain;

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
	
	public String toWildMatch() {
		return null;
	}
	
	public abstract int getStartTime();
	public abstract int getEndTime();
	public abstract String getInitPhrase();
	public abstract String getPhrase();

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
