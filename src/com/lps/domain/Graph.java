package com.lps.domain;

import java.util.ArrayList;
import java.util.List;

import com.lps.exception.CellStrMismatchException;
import com.lps.exception.NoConclusionException;
import com.lps.exception.RevCausalException;
import com.lps.utils.CellUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public abstract class Graph {
	protected List<Action> actions;
	protected List<Fluent> fluents;
	protected List<Condition> conditions;
	protected String name;
	protected String id;
	
	public Graph(String name, String id) {
		actions = new ArrayList<Action>();
		fluents = new ArrayList<Fluent>();
		conditions = new ArrayList<Condition>();
		this.name = name;
		this.id = id;
	}
	
	public boolean populate(String jsonString) {
		JSONObject jsonObject = JSONObject.fromObject(jsonString);
		JSONArray cells = jsonObject.getJSONArray("cells");
		for(int i = 0; i < cells.size(); i++) {
			JSONObject temp = cells.getJSONObject(i);
			if(temp.get("type").equals("standard.Ellipse")) {
				int y = temp.getJSONObject("position").getInt("y");
				JSONObject label = temp.getJSONObject("attrs").getJSONObject("label");
				String colour = label.getString("fill");
				String text = label.getString("text");
				int height = temp.getJSONObject("size").getInt("height");
				conditions.add(new Condition(CellUtils.isModified(colour), 
						CellUtils.isConclusion(colour), text, y, height));
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
	
	public abstract String getString() throws 
	CellStrMismatchException, NoConclusionException, RevCausalException;

	public List<Action> getActions() {
		return actions;
	}

	public List<Fluent> getFluents() {
		return fluents;
	}

	public String getName() {
		return name;
	}
	
	public String getId() {
		return id;
	}
}
