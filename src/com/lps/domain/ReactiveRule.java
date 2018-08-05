package com.lps.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ReactiveRule extends Graph {

	public ReactiveRule(String name) {
		super(name);
	}

	@Override
	public String toString() {
		List<Cell> premises = new ArrayList<Cell>();
		List<Action> conclusions = new ArrayList<Action>();
		for(Action a : actions) {
			if(a.isModified()) {
				if(a.isConclusion()) conclusions.add(a);
				else premises.add(a);
			}
		}
		for(Fluent f : fluents) {
			if(f.isModified()) premises.add(f);
		}
		Collections.sort(premises);
		Collections.sort(conclusions);
		
		StringBuffer sb = new StringBuffer();
		List<String> premisePhrase = new ArrayList<String>();
		List<String> conclusionPhrase = new ArrayList<String>();
		int temptime = 1;
		sb.append("if ");
		for(Cell c : premises) {
			premisePhrase.add(c.getPhrase());
			if(c.getStartTime() > temptime) 
				premisePhrase.add("T" + c.getStartTime() + " > T" + temptime);
			temptime = c.getEndTime();
		}
		for(Action a : conclusions) {
			conclusionPhrase.add(a.getPhrase());
			if(a.getStartTime() > temptime) 
				conclusionPhrase.add("T" + a.getStartTime() + " > T" + temptime);
			temptime = a.getEndTime();
		}
		sb.append(String.join(", ", premisePhrase));
		sb.append("\n").append("then ");
		sb.append(String.join(", ", conclusionPhrase));
		sb.append(".");
		return sb.toString();
	}

}
