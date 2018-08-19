package com.lps.domain;

import com.lps.exception.CellStrMismatchException;
import com.lps.utils.CellUtils;

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
	public String getInitPhrase() throws CellStrMismatchException {
		return CellUtils.toStandardForm(text);
	}
	
	@Override
	public String getPhrase() throws CellStrMismatchException {
		return CellUtils.toStandardForm(text) + " at T" + getStartTime();
	}

	public boolean isModified() {
		return isModified;
	}

	public void setModified(boolean isModified) {
		this.isModified = isModified;
	}	
	
}
