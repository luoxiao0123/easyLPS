package com.lps.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.lps.exception.CellStrMismatchException;

public class MacroAction extends Graph {
	
	public MacroAction(String name) {
		super(name);
	}	

	@Override
	public String getString() throws CellStrMismatchException {
		StringBuffer sb = new StringBuffer();
		List<Cell> premises = new ArrayList<Cell>();
		for(Action a : actions) {
			if(a.isModified()) premises.add(a);
		}
		for(Fluent f : fluents) {
			if(f.isModified()) premises.add(f);
		}
		for(Condition c : conditions) {
			if(c.isModified()) premises.add(c);
		}
		Collections.sort(premises);
		
		int temptime = 1;
		List<String> premisePhrase = new ArrayList<String>();
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
		sb.append(name).append(" from T1 to T").append(temptime).append(" if");
		sb.append("\n    ");
		sb.append(String.join(",\n    ", premisePhrase));
		sb.append(".");
		return sb.toString();
	}

}
