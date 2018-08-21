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
import com.lps.exception.CellStrMismatchException;
import com.lps.exception.NoConclusionException;
import com.lps.exception.RevCausalException;

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
		String jsonString = (String) request.getParameter("jsonStr");
		String graphType = (String) request.getParameter("graphType");
		String graphName = (String) request.getParameter("graphName");
		String graphId = (String) request.getParameter("graphId");
		if("initialize".equals(graphType)) {
			InitGraph initGraph = new InitGraph(graphName, graphId);
			initGraph.populate(jsonString);
			try {
				String str = initGraph.getString();
				response.getWriter().write(str);
			} catch (CellStrMismatchException e) {
				response.setStatus(400);
				response.getWriter().write(e.getMessage());
			}
		}else if("reactiverule".equals(graphType)) {
			ReactiveRule reactiveRule = new ReactiveRule(graphName, graphId);
			reactiveRule.populate(jsonString);
			try {
				String str = reactiveRule.getString();
				response.getWriter().write(str);
			} catch (CellStrMismatchException | NoConclusionException | RevCausalException e) {
				response.setStatus(400);
				response.getWriter().write(e.getMessage());
			}
		}else if("macroaction".equals(graphType)) {
			MacroAction macroAction = new MacroAction(graphName, graphId);
			macroAction.populate(jsonString);
			try {
				String str = macroAction.getString();
				response.getWriter().write(str);
			} catch (CellStrMismatchException e) {
				response.setStatus(400);
				response.getWriter().write(e.getMessage());
			}
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
