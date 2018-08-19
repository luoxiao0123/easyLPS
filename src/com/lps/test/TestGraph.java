package com.lps.test;

import org.junit.Test;

import com.lps.domain.InitGraph;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TestGraph {

	@Test
	public void testInit() {
//		InitGraph i = new InitGraph();
//		String jsonString = "{\"cells\":[{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":40},\"target\":{\"x\":580,\"y\":40},\"customLinkInteractions\":false,\"id\":\"b6ea7cc3-c5bd-47ed-b2bb-61a13bb2c297\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 1\"}}}],\"z\":1,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":80},\"target\":{\"x\":580,\"y\":80},\"customLinkInteractions\":false,\"id\":\"93414d4c-1d0d-4cf2-8d8d-4cc51c849765\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 2\"}}}],\"z\":2,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":120},\"target\":{\"x\":580,\"y\":120},\"customLinkInteractions\":false,\"id\":\"8baed01e-d71d-40bb-a163-ff25cbd8b6fd\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 3\"}}}],\"z\":3,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":160},\"target\":{\"x\":580,\"y\":160},\"customLinkInteractions\":false,\"id\":\"5d7f5acc-e006-431e-90f1-caecddbf16b2\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 4\"}}}],\"z\":4,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":200},\"target\":{\"x\":580,\"y\":200},\"customLinkInteractions\":false,\"id\":\"35705b4a-2241-4a70-a6f7-8ffaf7f98d7b\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 5\"}}}],\"z\":5,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":240},\"target\":{\"x\":580,\"y\":240},\"customLinkInteractions\":false,\"id\":\"44a70a5c-add9-41c5-a5cf-2962d3929b29\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 6\"}}}],\"z\":6,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":280},\"target\":{\"x\":580,\"y\":280},\"customLinkInteractions\":false,\"id\":\"259c33d8-c166-4a0d-81e9-1c5f8031fcb0\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 7\"}}}],\"z\":7,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":320},\"target\":{\"x\":580,\"y\":320},\"customLinkInteractions\":false,\"id\":\"78dc58d6-3cf0-4f53-a85e-fcbd1f836e76\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 8\"}}}],\"z\":8,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":360},\"target\":{\"x\":580,\"y\":360},\"customLinkInteractions\":false,\"id\":\"bbefcfb1-c647-44bb-ba86-9b5dbd5e92b1\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 9\"}}}],\"z\":9,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Link\",\"source\":{\"x\":10,\"y\":400},\"target\":{\"x\":580,\"y\":400},\"customLinkInteractions\":false,\"id\":\"0f688db5-5c6e-4a26-ad4c-6881c48f94e3\",\"labels\":[{\"attrs\":{\"text\":{\"text\":\"T = 10\"}}}],\"z\":10,\"attrs\":{\"line\":{\"targetMarker\":{\"type\":\"circle\"}}}},{\"type\":\"standard.Rectangle\",\"position\":{\"x\":250,\"y\":40},\"size\":{\"width\":100,\"height\":40},\"angle\":0,\"id\":\"a64049b9-282e-46a4-8815-47913a5ed0d8\",\"z\":11,\"attrs\":{\"body\":{\"fill\":\"green\"},\"label\":{\"fill\":\"black\",\"text\":\"action\"}}},{\"type\":\"standard.Polyline\",\"position\":{\"x\":250,\"y\":20},\"size\":{\"width\":100,\"height\":40},\"angle\":0,\"id\":\"f8096afb-0794-43f8-954f-512a0db31e83\",\"z\":12,\"attrs\":{\"body\":{\"fill\":\"#99ccff\"},\"label\":{\"fill\":\"black\",\"text\":\"fluent\"}}}]}";
//		i.populate(jsonString);
//		System.out.println(i.toString());
//		System.out.println("done");
	}
	
	@Test
	public void testRegex() {
		String regex = "[A-Za-z](\\w)*(\\((\\w)+(\\,(\\w)+)*\\))?";
		Pattern p = Pattern.compile(regex);
		Matcher m = p.matcher("a1(_,_)");
		System.out.println(m.matches());
	}
	
	@Test
	public void testString() {
		String str = "abc";
		System.out.println(str.replaceAll("\\,", ", "));
		System.out.println(str.substring(0, 1));
		str = null;
		System.out.println(str == "");
	}
}
