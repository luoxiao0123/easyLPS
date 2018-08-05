package com.lps.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.lps.utils.CellUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import net.sf.json.JsonConfig;

public class InitGraph extends Graph {
	
	public InitGraph(String name) {
		super(name);
	}
	
	
	@Override
	public String toString() {
		StringBuffer sb = new StringBuffer();
		Collections.sort(actions);
		Collections.sort(fluents);
		for(Action a : actions) {
			int startTime = CellUtils.indexOf(a.getY(), times);
			if(startTime > 0) {
				sb.append("observe ").append(a.getText()).append(" from ");
				sb.append(startTime).append(" to ");				
				sb.append(startTime + 1).append(".").append("\n");
			}
		}
		for(Fluent f : fluents) {
			sb.append("initially ").append(f.getText()).append(".").append("\n");
		}
		return sb.toString();
	}
}
