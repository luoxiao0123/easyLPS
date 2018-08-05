package com.lps.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MacroAction extends Graph {
	
	public MacroAction(String name) {
		super(name);
	}	

	@Override
	public String toString() {
		StringBuffer sb = new StringBuffer();
		List<Cell> premises = new ArrayList<Cell>();
		for(Action a : actions) {
			if(a.isModified()) premises.add(a);
		}
		for(Fluent f : fluents) {
			if(f.isModified()) premises.add(f);
		}
		Collections.sort(premises);
		
		int temptime = 1;
		List<String> premisePhrase = new ArrayList<String>();
		for(Cell c : premises) {
			premisePhrase.add(c.getPhrase());
			if(c.getStartTime() > temptime) 
				premisePhrase.add("T" + c.getStartTime() + " > T" + temptime);
			temptime = c.getEndTime();
		}
		sb.append(name).append(" from T1 to T").append(temptime).append(" if");
		sb.append("\n    ");
		sb.append(String.join(",\n    ", premisePhrase));
		sb.append(".");
		return sb.toString();
	}

}
