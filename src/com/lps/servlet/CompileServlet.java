package com.lps.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lps.domain.GraphModel;
import com.lps.exception.CellStrMismatchException;
import com.lps.exception.NoConclusionException;
import com.lps.exception.RevCausalException;

/**
 * Servlet implementation class CompileServlet
 */
@WebServlet("/CompileServlet")
public class CompileServlet extends HttpServlet {
	private static final long serialVersionUID = 2L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public CompileServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("Content-type", "text/html;charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		String graphJson = (String) request.getParameter("graphJson");
		GraphModel graphModel = new GraphModel();
		try {
			graphModel.populate(graphJson);
			response.getWriter().write(graphModel.toJSONObject().toString());
		} catch (CellStrMismatchException | NoConclusionException | RevCausalException e) {
			response.setStatus(400);
			response.getWriter().write(e.getMessage());
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

}
