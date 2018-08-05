package com.lps.domain;

public class Fluent extends Cell {
	private boolean isModified;
	
	public Fluent(boolean isModified, String text, int y, int height) {
		super(text, y, height);
		this.isModified = isModified;
	}
	
	@Override
	public int getStartTime() {
		return (y + TIME_INTERVAL / 2) / TIME_INTERVAL;
	}
	
	@Override
	public int getEndTime() {
		return (y + height - TIME_INTERVAL / 2) / TIME_INTERVAL;
	}
	
	@Override
	public String getInitPhrase() {
		return "initially " + text + ".";
	}
	
	@Override
	public String getPhrase() {
		return text + " at T" + getStartTime();
	}

	public boolean isModified() {
		return isModified;
	}

	public void setModified(boolean isModified) {
		this.isModified = isModified;
	}	
	
}
