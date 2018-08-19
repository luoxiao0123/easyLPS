package com.lps.domain;

import com.lps.exception.CellStrMismatchException;
import com.lps.utils.CellUtils;

import net.sf.json.JSONObject;

public class CausalLaw {
	private String action;
	private String cause;
	private String fluent;
	private String condition;
	
	public CausalLaw(String jsonString) {
		JSONObject jsonObject = JSONObject.fromObject(jsonString);
		this.action = jsonObject.getString("action");
		this.cause = jsonObject.getString("cause");
		this.fluent = jsonObject.getString("fluent");
		this.condition = jsonObject.getString("condition");
	}
	
	public String getString() {
		String actionStd = "";
		try {
			actionStd = CellUtils.toStandardForm(action);
		} catch (CellStrMismatchException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		String fluentStd = "";
		try {
			fluentStd = CellUtils.toStandardForm(fluent);
		} catch (CellStrMismatchException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		StringBuffer sb = new StringBuffer();
		sb.append(actionStd).append(" ").append(cause).append(" ").append(fluentStd);
		if(!condition.equals("")) {
			sb.append(" if ").append(condition.trim());
		}
		sb.append(".");
		return sb.toString();
	}
}
