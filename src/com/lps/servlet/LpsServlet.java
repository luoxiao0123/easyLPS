package com.lps.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.lps.domain.Page;
import com.lps.exception.CellStrMismatchException;
import com.lps.exception.NoConclusionException;
import com.lps.exception.NoPremiseException;
import com.lps.exception.RevCausalException;

/**
 * Servlet implementation class LpsServlet
 */
@WebServlet("/LpsServlet")
public class LpsServlet extends HttpServlet {
	private static final long serialVersionUID = 9L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LpsServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("Content-type", "text/html;charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		String pageJson = (String) request.getParameter("pageJson");
		Page page = new Page();
		try {
			page.populate(pageJson);
			response.getWriter().write(page.toJSONObject().toString());
		} catch (CellStrMismatchException | NoConclusionException | RevCausalException | NoPremiseException e) {
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
