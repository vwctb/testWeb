package kr.controller;

import java.io.FileInputStream;
import java.io.IOException;
import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Properties;
import java.util.Iterator;
import java.util.Map;
import java.util.HashMap;
			
public class ControllerURI extends HttpServlet{
	
	private Map commandMap = new HashMap();
	
	public void init(ServletConfig config)throws ServletException{
		
		//모델 클래스 명세가 입력되어 있는 properties 설정 파일의 경로를 읽어옴(/WEB-INF/Command.properties)
		String props = config.getInitParameter("propertyConfig");
		
		Properties pr = new Properties();
		FileInputStream f = null;
		
		try{
			
			//properties 파일의 절대 경로를 구함
			String path = config.getServletContext().getRealPath(props);
			//파일 정보를 읽어옴
			f = new FileInputStream(path);
			//읽어온 파일의 내용을 분석해서 key와 value 쌍으로 인식
			pr.load(f);			
		}catch(IOException e){
			throw new ServletException(e);
		}finally{
			if(f!=null)try{f.close();}catch(IOException e){}
		}
		
		//Properties 객체에서 key를 구함
		Iterator keyIter = pr.keySet().iterator();
		while(keyIter.hasNext()){
			//key를 구함
			String command = (String)keyIter.next();
			//value를 구함
			String className = pr.getProperty(command);
			try{
				//클래스명을 통해서 클래스를 호출
				Class commandClass = Class.forName(className);
				//호출된 클래스를 객체생성
				Object commandInstance = commandClass.newInstance();
				//key와 value(객체)를 HashMap에 저장
				commandMap.put(command,commandInstance);
			}catch(ClassNotFoundException e){
				throw new ServletException(e);
			}catch(InstantiationException e){
				throw new ServletException(e);		
			}catch(IllegalAccessException e){
				throw new ServletException(e);
			}
		}
	}
	
	public void doGet(HttpServletRequest request, 
			HttpServletResponse response) throws ServletException, IOException{
		requestPro(request,response);
	}
	
	public void doPost(HttpServletRequest request, 
			HttpServletResponse response)throws ServletException, IOException{
		requestPro(request,response);
	}
	
	private void requestPro(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException{
		
		String view = "";
		Action com = null;
		
		try{
			String command = request.getRequestURI();
			System.out.println("command : " + command);
			System.out.println("contextPath  : " + request.getContextPath());
			if(command.indexOf(request.getContextPath())==0){
				command = command.substring(request.getContextPath().length());
				System.out.println("command : " + command);
			}
			com = (Action)commandMap.get(command);	
			
			view = com.excute(request, response);
		}catch(Throwable e){
			e.printStackTrace();
		}
		//view 호출
		RequestDispatcher dispactcher = request.getRequestDispatcher(view);
		dispactcher.forward(request,response);
	}
}
