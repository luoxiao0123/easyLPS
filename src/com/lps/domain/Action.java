package com.lps.domain;

public class Action extends Cell{
	private boolean isModified;
	private boolean isConclusion;
	
	public Action(boolean isModified, boolean isConclusion, String text, int y, int height) {
		super(text, y, height);
		this.isModified = isModified;
		this.isConclusion = isConclusion;
	}
	
	@Override
	public int getStartTime() {
		return y / TIME_INTERVAL;
	}
	
	@Override
	public int getEndTime() {
		return (y + height) / TIME_INTERVAL;
	}
	
	@Override
	public String getInitPhrase() {
		StringBuffer sb = new StringBuffer();
		sb.append("observe ").append(text).append(" from ");
		sb.append(getStartTime()).append(" to ").append(getEndTime()).append(".");
		return sb.toString();
	}
	
	@Override
	public String getPhrase() {
		StringBuffer sb = new StringBuffer();
		sb.append(text).append(" from T").append(getStartTime())
		.append(" to T").append(getEndTime());
		return sb.toString();
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
