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
		
		//�� Ŭ���� ���� �ԷµǾ� �ִ� properties ���� ������ ��θ� �о��(/WEB-INF/Command.properties)
		String props = config.getInitParameter("propertyConfig");
		
		Properties pr = new Properties();
		FileInputStream f = null;
		
		try{
			
			//properties ������ ���� ��θ� ����
			String path = config.getServletContext().getRealPath(props);
			//���� ������ �о��
			f = new FileInputStream(path);
			//�о�� ������ ������ �м��ؼ� key�� value ������ �ν�
			pr.load(f);			
		}catch(IOException e){
			throw new ServletException(e);
		}finally{
			if(f!=null)try{f.close();}catch(IOException e){}
		}
		
		//Properties ��ü���� key�� ����
		Iterator keyIter = pr.keySet().iterator();
		while(keyIter.hasNext()){
			//key�� ����
			String command = (String)keyIter.next();
			//value�� ����
			String className = pr.getProperty(command);
			try{
				//Ŭ�������� ���ؼ� Ŭ������ ȣ��
				Class commandClass = Class.forName(className);
				//ȣ��� Ŭ������ ��ü����
				Object commandInstance = commandClass.newInstance();
				//key�� value(��ü)�� HashMap�� ����
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
		//view ȣ��
		RequestDispatcher dispactcher = request.getRequestDispatcher(view);
		dispactcher.forward(request,response);
	}
}
