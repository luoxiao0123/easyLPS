package com.lps.domain;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;

import com.lps.exception.CellStrMismatchException;
import com.lps.exception.NoConclusionException;
import com.lps.exception.RevCausalException;
import com.lps.utils.CellUtils;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class Page {
	private List<InitGraph> initGraphs;
	private List<ReactiveRule> reactiveRules;
	private List<MacroAction> macroActions;
	private Set<String> causalTheorys;
	private Set<String> preconditions;
	private Set<String> actions_std;
	private Set<String> fluents_std;
	private Set<String> macros_std;
	private Set<String> actions_wild;
	private Set<String> fluents_wild;
	private Set<String> macros_wild;
	
	public Page() {
		initGraphs = new ArrayList<InitGraph>();
		reactiveRules = new ArrayList<ReactiveRule>();
		macroActions = new ArrayList<MacroAction>();
		causalTheorys = new HashSet<String>();
		preconditions = new HashSet<String>();
		actions_std = new HashSet<String>();
		fluents_std = new HashSet<String>();
		macros_std = new HashSet<String>();
		actions_wild = new HashSet<String>();
		fluents_wild = new HashSet<String>();
		macros_wild = new HashSet<String>();
	}
	
	
	public boolean populate(String jsonString) throws CellStrMismatchException {
		JSONObject pageJson = JSONObject.fromObject(jsonString);
		JSONObject graphJson = pageJson.getJSONObject("graphJson");
		JSONArray causalArray = pageJson.getJSONArray("causalJson");
		JSONArray precondArray = pageJson.getJSONArray("precondJson");
		JSONArray initArray = graphJson.getJSONArray("initGraph");
		JSONArray reactArray = graphJson.getJSONArray("reactGraph");
		JSONArray macroArray = graphJson.getJSONArray("macroGraph");
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
		for(int i = 0; i < causalArray.size(); i++) {
			JSONObject causalObj = causalArray.getJSONObject(i);
			String text = causalObj.getString("text");
			String causalAction = causalObj.getString("action");
			String causalFluent = causalObj.getString("fluent");
			causalTheorys.add(text);
			getActionAndFluent(causalAction, causalFluent, text);
		}
		for(int i = 0; i < precondArray.size(); i++) {
			JSONObject precondObj = precondArray.getJSONObject(i);
			preconditions.add(precondObj.getString("text"));
		}
		return true;
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
	
	private void getActionAndFluent(String action, String fluent, String text)
			throws CellStrMismatchException {
		try {
			actions_std.add(CellUtils.toStandardForm(action));
			actions_wild.add(CellUtils.toWildMatch(action));
		} catch(CellStrMismatchException e) {
			String message = "action " + action + " in causal theory\n"
					+ text + "\n is not in a valid form";
			throw new CellStrMismatchException(message);
		}
		try {
			fluents_std.add(CellUtils.toStandardForm(fluent));
			fluents_wild.add(CellUtils.toWildMatch(fluent));
		} catch (CellStrMismatchException e) {
			String message = "fluent " + fluent + " in causal theory\n"
					+ text + "\n is not in a valid form";
			throw new CellStrMismatchException(message);
		}
	}
	
	private String getHeader() {
		StringBuffer sb = new StringBuffer();
		if(actions_wild.size() > 0) {
			sb.append("actions ").append(String.join(", ", actions_wild)).append(".\n");
		}
		if(fluents_wild.size() > 0) {
			sb.append("fluents ").append(String.join(", ", fluents_wild)).append(".\n");
		}
		return sb.toString();
	}
	
	private String getCausalTheorys() {
		StringBuffer sb = new StringBuffer();
		sb.append(String.join("\n", causalTheorys));
		return sb.toString();
	}
	
	private String getPreconditions() {
		StringBuffer sb = new StringBuffer();
		sb.append(String.join("\n", preconditions));
		return sb.toString();
	}
	
	private JSONObject graphToJson(Graph graph) 
			throws CellStrMismatchException, NoConclusionException, RevCausalException {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("id", graph.getId());
		jsonObject.put("text", graph.getString());
		return jsonObject;
	}
	
	public String getString() throws CellStrMismatchException, 
	NoConclusionException, RevCausalException {
		StringBuffer sb = new StringBuffer();
		sb.append(getHeader());
		for(InitGraph initGraph : initGraphs) {
			sb.append(initGraph.getString()).append("\n");			
		}
		for(MacroAction macroAction : macroActions) {
			sb.append(macroAction.getString()).append("\n");
		}
		for(ReactiveRule reactiveRule : reactiveRules) {
			sb.append(reactiveRule.getString()).append("\n");
		}
		sb.append(getCausalTheorys()).append("\n");
		sb.append(getPreconditions());
		return sb.toString();
	}
	
	public JSONObject toJSONObject() throws CellStrMismatchException, 
	NoConclusionException, RevCausalException {
		JSONObject jsonObject = new JSONObject();
		jsonObject.put("header", getHeader());
		List<JSONObject> graphJson = new LinkedList<JSONObject>();
		for(InitGraph initGraph : initGraphs) {
			graphJson.add(graphToJson(initGraph));
		}
		for(MacroAction macroAction : macroActions) {
			graphJson.add(graphToJson(macroAction));
		}
		for(ReactiveRule reactiveRule : reactiveRules) {
			graphJson.add(graphToJson(reactiveRule));
		}
		JSONArray graphJsonArray = JSONArray.fromObject(graphJson);
		jsonObject.put("graph", graphJsonArray);
		jsonObject.put("causalTheory", getCausalTheorys());
		jsonObject.put("precondition", getPreconditions());
		
		Set<String> actions = new HashSet<String>();
		Set<String> fluents = new HashSet<String>();
		Set<String> macros = new HashSet<String>();
		actions.addAll(actions_std);
		actions.addAll(actions_wild);
		fluents.addAll(fluents_std);
		fluents.addAll(fluents_wild);
		macros.addAll(macros_std);
		macros.addAll(macros_wild);
		
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
