package com.lps.io;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class JsonConverter {
	public static String jsonStringToClause(String jsonString) {
		JSONObject jsonObject = JSONObject.fromObject(jsonString);
		JSONArray cells = jsonObject.getJSONArray("cells");
		return null;
	}
}
