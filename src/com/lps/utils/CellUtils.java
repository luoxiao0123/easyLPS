package com.lps.utils;

public class CellUtils {
	static final String COLOUR_MODIFIED = "white";
	static final String COLOUR_UNMODIFIED = "black";
	static final String COLOUR_CONCLUSION = "red";

	public static boolean isModified(String colour) {
		return !COLOUR_UNMODIFIED.equals(colour);
	}
	
	public static boolean isConclusion(String colour) {
		return COLOUR_CONCLUSION.equals(colour);
	}
	
	public static int indexOf(int num, int[] array) {
		for(int i = 0; i < array.length; i++) {
			if(num == array[i]) return i;
		}
		return -1;
	}
	
}
