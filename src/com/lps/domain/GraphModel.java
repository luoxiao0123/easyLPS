package com.lps.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.lps.exception.CellStrMismatchException;
import com.lps.exception.NoConclusionException;
import com.lps.exception.RevCausalException;
import com.lps.utils.CellUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class GraphModel {
	List<InitGraph> initGraphs;
	List<ReactiveRule> reactiveRules;
	List<MacroAction> macroActions;
	Set<String> actions_std;
	Set<String> fluents_std;
	Set<String> macros_std;
	Set<String> actions_wild;
	Set<String> fluents_wild;
	Set<String> macros_wild;
	
	public GraphModel() {
		initGraphs = new ArrayList<InitGraph>();
		reactiveRules = new ArrayList<ReactiveRule>();
		macroActions = new ArrayList<MacroAction>();
		actions_std = new HashSet<String>();
		fluents_std = new HashSet<String>();
		macros_std = new HashSet<String>();
		actions_wild = new HashSet<String>();
		fluents_wild = new HashSet<String>();
		macros_wild = new HashSet<String>();
	}
	
	public boolean populate(String jsonString) throws CellStrMismatchException {
		JSONObject jsonObject = JSONObject.fromObject(jsonString);
		JSONArray initArray = jsonObject.getJSONArray("initGraph");
		JSONArray reactArray = jsonObject.getJSONArray("reactGraph");
		JSONArray macroArray = jsonObject.getJSONArray("macroGraph");
		for(int i = 0; i < initArray.size(); i++) {
			JSONObject initObj = initArray.getJSONObject(i);
			String name = initObj.getString("graphName");
			String id = initObj.getString("graphId");
			InitGraph initGraph = new InitGraph(name, id);
			initGraph.populate(initObj.getString("jsonStr"));
			initGraphs.add(initGraph);
			getActionAndFluent(initGraph);
		}
		for(int i = 0; i < reactArray.size(); i++) {
			JSONObject reactObj = reactArray.getJSONObject(i);
			String name = reactObj.getString("graphName");
			String id = reactObj.getString("graphId");
			ReactiveRule reactiveRule = new ReactiveRule(name, id);
			reactiveRule.populate(reactObj.getString("jsonStr"));
			reactiveRules.add(reactiveRule);
			getActionAndFluent(reactiveRule);
		}
		for(int i = 0; i < macroArray.size(); i++) {
			JSONObject macroObj = macroArray.getJSONObject(i);
			String name = macroObj.getString("graphName");
			String id = macroObj.getString("graphId");
			MacroAction macroAction = new MacroAction(name, id);
			macroAction.populate(macroObj.getString("jsonStr"));
			macroActions.add(macroAction);
			getActionAndFluent(macroAction);
		}
		return true;
	}
	
	public String getString() throws CellStrMismatchException, 
	NoConclusionException, RevCausalException {
		StringBuffer sb = new StringBuffer();
		if(actions_wild.size() > 0) {
			sb.append("actions ").append(String.join(", ", actions_wild)).append(".\n");
		}
		if(fluents_wild.size() > 0) {
			sb.append("fluents ").append(String.join(", ", fluents_wild)).append(".\n");
		}
		for(InitGraph initGraph : initGraphs) {
			sb.append(initGraph.getString()).append("\n");			
		}
		for(MacroAction macroAction : macroActions) {
			sb.append(macroAction.getString()).append("\n");
		}
		for(ReactiveRule reactiveRule : reactiveRules) {
			sb.append(reactiveRule.getString()).append("\n");
		}
		return sb.toString();
	}
	
	private void getActionAndFluent(Graph graph) throws CellStrMismatchException {
		for(Action a : graph.getActions()) {
			try {
				actions_std.add(CellUtils.toStandardForm(a.getText()));
				actions_wild.add(CellUtils.toWildMatch(a.getText()));
			} catch (CellStrMismatchException e) {
				String message = "action " + a.getText() + " in initGraph "
						+ graph.name + " is not in a valid form";
				throw new CellStrMismatchException(message);
			}
		}
		for(Fluent f : graph.getFluents()) {
			try {
				fluents_std.add(CellUtils.toStandardForm(f.getText()));
				fluents_wild.add(CellUtils.toWildMatch(f.getText()));
			} catch (CellStrMismatchException e) {
				String message = "fluent " + f.getText() + " in initGraph "
						+ graph.name + " is not in a valid form";
				throw new CellStrMismatchException(message);
			}
		}
		for(MacroAction m : macroActions) {
			try {
				macros_std.add(CellUtils.toStandardForm(m.getName()));
				macros_wild.add(CellUtils.toWildMatch(m.getName()));
			} catch (CellStrMismatchException e) {
				String message = "the name of macroaction " + m.getName()
						+ " is invalid";
				throw new CellStrMismatchException(message);
			}
		}
		actions_std.removeAll(macros_std);
		actions_wild.removeAll(macros_wild);
	}
	
	public JSONObject toJSONObject() throws CellStrMismatchException, 
	NoConclusionException, RevCausalException {
		Set<String> actions = new HashSet<String>();
		Set<String> fluents = new HashSet<String>();
		Set<String> macros = new HashSet<String>();
		actions.addAll(actions_std);
		actions.addAll(actions_wild);
		fluents.addAll(fluents_std);
		fluents.addAll(fluents_wild);
		macros.addAll(macros_std);
		macros.addAll(macros_wild);
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("code", getString());
		JSONArray actionArray = JSONArray.fromObject(actions);
		jsonObject.put("actions", actionArray);
		JSONArray fluentArray = JSONArray.fromObject(fluents);
		jsonObject.put("fluents", fluentArray);
		JSONArray macroArray = JSONArray.fromObject(macros);
		jsonObject.put("macros", macroArray);
		JSONArray actionArray_wild = JSONArray.fromObject(actions_wild);
		jsonObject.put("actionsWild", actionArray_wild);
		JSONArray fluentArray_wild = JSONArray.fromObject(fluents_wild);
		jsonObject.put("fluentsWild", fluentArray_wild);
		JSONArray macroArray_wild = JSONArray.fromObject(macros_wild);
		jsonObject.put("macrosWild", macroArray_wild);
		return jsonObject;
	}
}
