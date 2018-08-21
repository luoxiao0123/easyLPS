package com.lps.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.lps.exception.CellStrMismatchException;
import com.lps.exception.NoConclusionException;
import com.lps.exception.RevCausalException;

public class ReactiveRule extends Graph {

	public ReactiveRule(String name, String id) {
		super(name, id);
	}

	@Override
	public String getString() throws CellStrMismatchException, 
	NoConclusionException, RevCausalException {
		List<Cell> premises = new ArrayList<Cell>();
		List<Cell> conclusions = new ArrayList<Cell>();
		for(Action a : actions) {
			if(a.isModified()) {
				if(a.isConclusion()) conclusions.add(a);
				else premises.add(a);
			}
		}
		for(Fluent f : fluents) {
			if(f.isModified()) premises.add(f);
		}
		for(Condition c : conditions) {
			if(c.isModified()) {
				if(c.isConclusion()) conclusions.add(c);
				else premises.add(c);
			}
		}
		if(conclusions.size() == 0) {
			String message = "ReactiveRule " + this.name + " does not have"
					+ " a conclusion";
			throw new NoConclusionException(message);
		}
		Collections.sort(premises);
		Collections.sort(conclusions);
		
		StringBuffer sb = new StringBuffer();
		List<String> premisePhrase = new ArrayList<String>();
		List<String> conclusionPhrase = new ArrayList<String>();
		int temptime = 1, concluStartTime = 100;
		sb.append("if ");
		for(Cell c : premises) {
			try {
				premisePhrase.add(c.getPhrase());
			} catch (CellStrMismatchException e) {
				String cellType = c instanceof Action ? "action " : "fluent ";
				String message = cellType + c.getText() + " in initGraph "
						+ this.name + " is not in a valid form";
				throw new CellStrMismatchException(message);
			}
			if(c.getStartTime() > 0) {
				if(c.getStartTime() > temptime) 
					premisePhrase.add("T" + c.getStartTime() + " > T" + temptime);
				temptime = c.getEndTime();
			}
		}
		for(Cell c : conclusions) {
			if(c.getStartTime() > 0) {
				concluStartTime = c.getStartTime();
				break;
			}
		}
		if(temptime > concluStartTime) {
			String message = "ReactiveRule " + this.name + " has conclusion "
					+ conclusions.get(0).getText() + " occurred earlier than"
					+ " at least one premise";
			throw new RevCausalException(message);
		}
		for(Cell a : conclusions) {
			try {
				conclusionPhrase.add(a.getPhrase());
			} catch (CellStrMismatchException e) {
				String message = "action " + a.getText() + " in initGraph "
						+ this.name + " is not in a valid form";
				throw new CellStrMismatchException(message);
			}
			if(a.getStartTime() > 0) {
				if(a.getStartTime() > temptime) 
					conclusionPhrase.add("T" + a.getStartTime() + " > T" + temptime);
				temptime = a.getEndTime();
			}
		}
		sb.append(String.join(", ", premisePhrase));
		sb.append("\n").append("then ");
		sb.append(String.join(", ", conclusionPhrase));
		sb.append(".");
		return sb.toString();
	}

}
