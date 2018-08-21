package com.lps.domain;

import com.lps.exception.CellStrMismatchException;

public class Condition extends Cell{
	private boolean isModified;
	private boolean isConclusion;
	
	public Condition(boolean isModified, boolean isConclusion, String text, int y, int height) {
		super(text, y, height);
		this.isModified = isModified;
		this.isConclusion = isConclusion;
	}
	
	@Override
	public int getStartTime() {
		return 0;
	}

	@Override
	public int getEndTime() {
		return 0;
	}

	@Override
	public String getInitPhrase() throws CellStrMismatchException {
		return text + ".";
	}

	@Override
	public String getPhrase() throws CellStrMismatchException {
		return text;
	}

	public boolean isModified() {
		return isModified;
	}

	public void setModified(boolean isModified) {
		this.isModified = isModified;
	}

	public boolean isConclusion() {
		return isConclusion;
	}

	public void setConclusion(boolean isConclusion) {
		this.isConclusion = isConclusion;
	}

	
}
