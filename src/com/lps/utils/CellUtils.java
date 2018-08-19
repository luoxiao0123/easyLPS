package com.lps.utils;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.lps.exception.CellStrMismatchException;

public class CellUtils {
	static final String COLOUR_MODIFIED = "white";
	static final String COLOUR_UNMODIFIED = "black";
	static final String COLOUR_CONCLUSION = "red";
	static final String REGEX = "[a-z_](\\w)*(\\((\\w)+(\\, (\\w)+)*\\))?";

	public static boolean isModified(String colour) {
		return !COLOUR_UNMODIFIED.equals(colour);
	}
	
	public static boolean isConclusion(String colour) {
		return COLOUR_CONCLUSION.equals(colour);
	}
	
	public static String toStandardForm(String text) throws CellStrMismatchException {
		Pattern pattern = Pattern.compile(REGEX);
		Matcher matcher = pattern.matcher(text);
		if(!matcher.matches()) {
			throw new CellStrMismatchException();
		}
		return text;
	}
	
	public static String toWildMatch(String text) throws CellStrMismatchException {
		Pattern pattern = Pattern.compile(REGEX);
		Matcher matcher = pattern.matcher(text);
		if(!matcher.matches()) {
			throw new CellStrMismatchException();
		}
		if(text.indexOf('(') == -1) return text;
		StringBuffer sb = new StringBuffer();
		sb.append(text.substring(0, text.indexOf('('))).append("(_");
		for(int i = text.indexOf('('); i < text.length(); i++) {
			if(text.charAt(i) == ',') {
				sb.append(", _");
			}
		}
		sb.append(")");
		return sb.toString();
	}
	
}
