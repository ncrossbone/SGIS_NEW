<%@page session="false"%>
<%@page import="java.net.*,java.io.*" %>
<%@page import="java.util.StringTokenizer"%>
<%
response.setHeader("Access-Control-Allow-Origin","*");
response.setHeader("Access-Control-Allow-Headers", "origin, x-requested-with, content-type, accept, X-PINGOTHER");
try {
	String reqUrl = request.getQueryString();
	URL url = new URL(reqUrl);
	HttpURLConnection con = (HttpURLConnection)url.openConnection();
	con.setDoOutput(true);
	con.setRequestMethod(request.getMethod());
	if(request.getContentType() != null) {
	  con.setRequestProperty("Content-Type", request.getContentType());
    }
	int clength = request.getContentLength();
	if(clength > 0) {
		con.setDoInput(true);
		InputStream istream = request.getInputStream();
		OutputStream os = con.getOutputStream();
		final int length = 5000;
	  byte[] bytes = new byte[length];
	  int bytesRead = 0;
	  while ((bytesRead = istream.read(bytes, 0, length)) > 0) {
	    os.write(bytes, 0, bytesRead);
	  }
	}
	out.clear();
  	out = pageContext.pushBody();
	OutputStream ostream = response.getOutputStream();
	response.setContentType(con.getContentType());
	
	if(con.getContentType().equals("application/octet-stream;charset=utf-8")){
		String cd = con.getHeaderField("Content-Disposition");
		response.setHeader("Content-Disposition","attachment; filename="+cd.substring(21,cd.length()-1)+";");
	}
	InputStream in = con.getInputStream();
	final int length = 5000;
  	byte[] bytes = new byte[length];
  	int bytesRead = 0;
  	while ((bytesRead = in.read(bytes, 0, length)) > 0) {
    	ostream.write(bytes, 0, bytesRead);
  	}
}catch(Exception e) {
	response.setStatus(200);
}
%>