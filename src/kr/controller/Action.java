package kr.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface Action {
	public String excute(HttpServletRequest request,HttpServletResponse response) throws Throwable;
	
}
