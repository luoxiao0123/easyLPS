package com.lps.domain;

import java.util.ArrayList;
import java.util.List;

import com.lps.utils.CellUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public abstract class Graph {
	protected int[] times;
	protected List<Action> actions;
	protected List<Fluent> fluents;
	protected String name;
	
	public Graph(String name) {
		times = new int[41];
		actions = new ArrayList<Action>();
		fluents = new ArrayList<Fluent>();
		this.name = name;
	}
	
	public boolean populate(String jsonString) {
		JSONObject jsonObject = JSONObject.fromObject(jsonString);
		JSONArray cells = jsonObject.getJSONArray("cells");
		int timeIndex;
		if(this instanceof InitGraph) timeIndex = 4;
		else timeIndex = 1;
		for(int i = 0; i < cells.size(); i++) {
			JSONObject temp = cells.getJSONObject(i);
			if(temp.get("type").equals("standard.Link")) {
				int y = temp.getJSONObject("source").getInt("y");
				String time = temp.getJSONArray("labels").getJSONObject(0)
						.getJSONObject("attrs").getJSONObject("text").getString("text");
				int timeInt = Integer.parseInt(time.substring(timeIndex));
				times[timeInt] = y;
			} else if(temp.get("type").equals("standard.Rectangle")) {
				int y = temp.getJSONObject("position").getInt("y");
				JSONObject label = temp.getJSONObject("attrs").getJSONObject("label");
				String colour = label.getString("fill");
				String text = label.getString("text");
				int height = temp.getJSONObject("size").getInt("height");
				actions.add(new Action(CellUtils.isModified(colour), 
						CellUtils.isConclusion(colour), text, y, height));
			} else if(temp.get("type").equals("standard.Polyline")) {
				int y = temp.getJSONObject("position").getInt("y");
				JSONObject label = temp.getJSONObject("attrs").getJSONObject("label");
				String colour = label.getString("fill");
				String text = label.getString("text");
				int height = temp.getJSONObject("size").getInt("height");
				fluents.add(new Fluent(CellUtils.isModified(colour), 
						text, y, height));
			}
		}
		return true;
	}
	
	public abstract String toString();
}
