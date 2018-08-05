package com.lps.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lps.domain.InitGraph;
import com.lps.domain.MacroAction;
import com.lps.domain.ReactiveRule;

/**
 * Servlet implementation class ClauseServlet
 */
@WebServlet("/ClauseServlet")
public class ClauseServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ClauseServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		response.setHeader("Content-type", "text/html;charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		String jsonString = (String) request.getParameter("jsonObj");
		String graphType = (String) request.getParameter("graphType");
		String graphName = (String) request.getParameter("graphName");
		if("initialize".equals(graphType)) {
			InitGraph initGraph = new InitGraph(graphName);
			initGraph.populate(jsonString);
			response.getWriter().write(initGraph.toString());
		}else if("reactiverule".equals(graphType)) {
			ReactiveRule reactiveRule = new ReactiveRule(graphName);
			reactiveRule.populate(jsonString);
			response.getWriter().write(reactiveRule.toString());
		}else if("macroaction".equals(graphType)) {
			MacroAction macroAction = new MacroAction(graphName);
			macroAction.populate(jsonString);
			response.getWriter().write(macroAction.toString());
		}

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
