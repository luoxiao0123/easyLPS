package com.lps.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import com.lps.exception.CellStrMismatchException;

public class InitGraph extends Graph {
	
	public InitGraph(String name, String id) {
		super(name, id);
	}
	
	
	@Override
	public String getString() throws CellStrMismatchException {
		StringBuffer sb = new StringBuffer();
		Collections.sort(actions);
		Collections.sort(fluents);
		for(Action a : actions) {
			int startTime = a.getStartTime();
			if(startTime > 0) {
				try {
					sb.append(a.getInitPhrase()).append("\n");
				} catch (CellStrMismatchException e) {
					String message = "action " + a.getText() + " in initGraph "
							+ this.name + " is not in a valid form";
					throw new CellStrMismatchException(message);
				}
			}
		}
		List<String> fluentStr = new ArrayList<String>();
		for(Fluent f : fluents) {
			try {
				fluentStr.add(f.getInitPhrase());
			} catch (CellStrMismatchException e) {
				String message = "fluent " + f.getText() + " in initGraph "
						+ this.name + " is not in a valid form";
				throw new CellStrMismatchException(message);
			}
		}
		if(fluentStr.size() > 0) {
			sb.append("initially ").append(String.join(", ", fluentStr)).append(".\n");
		}
		for(Condition c : conditions) {
			sb.append(c.getInitPhrase()).append("\n");
		}
		return sb.toString();
	}
}
