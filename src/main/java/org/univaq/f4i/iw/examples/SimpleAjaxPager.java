package org.univaq.f4i.iw.examples;

import it.univaq.f4i.iw.framework.result.FailureResult;
import it.univaq.f4i.iw.framework.result.TemplateManagerException;
import it.univaq.f4i.iw.framework.result.TemplateResult;
import it.univaq.f4i.iw.framework.security.SecurityHelpers;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 *
 * @author Giuseppe
 */
public class SimpleAjaxPager extends HttpServlet {

    //crea una lista di oggetti Result causali
    //creates a list of random Result objects
    private List<Result> getResults(int page) {
        List resultlist = new ArrayList();
        for (int i = 1; i <= 10; ++i) {
            Result r = new Result();
            r.setNumber(100000 + ((page - 1) * 10) + i);
            r.setGrade(page + i);
            resultlist.add(r);
        }
        return resultlist;
    }

    private void action_default(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, TemplateManagerException {
        int page = 1;
        if (request.getParameter("page") != null) {
            page = SecurityHelpers.checkNumeric(request.getParameter("page"));
        }
        request.setAttribute("resultlist", getResults(page));
        request.setAttribute("totpages", 5); //fixed in this example
        request.setAttribute("curpage", page); //fixed in this example
        TemplateResult res = new TemplateResult(getServletContext());
        res.activate("simplepager.ftl.html", request, response);
    }

    private void action_json(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException, TemplateManagerException {
        int page = 1;
        if (request.getParameter("page") != null) {
            page = SecurityHelpers.checkNumeric(request.getParameter("page"));
        }
        request.setAttribute("resultlist", getResults(page));
        request.setAttribute("totpages", 5); //fixed in this example
        request.setAttribute("curpage", page); //fixed in this example

        TemplateResult res = new TemplateResult(getServletContext());
        res.activate("simplepager.ftl.json", request, response);
    }

    /**
     * Processes requests for both HTTP <code>GET</code> and <code>POST</code>
     * methods.
     *
     * @param request servlet request
     * @param response servlet response
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) {
        try {
            if (request.getParameter("json") != null) {
                action_json(request, response);
            } else {
                action_default(request, response);
            }

        } catch (TemplateManagerException | IOException | ServletException ex) {
            FailureResult failure = new FailureResult(getServletContext());
            failure.activate(ex, request, response);
        }
    }

    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
