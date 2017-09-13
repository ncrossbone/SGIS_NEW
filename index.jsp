<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>    
<%@ page import="com.sgis.login.LoginSessionMisc"%>
<%
	request.setCharacterEncoding("UTF-8");
	response.setCharacterEncoding("UTF-8");
	String memId 		= LoginSessionMisc.getMemId(request)		== null ? "" : (String)LoginSessionMisc.getMemId(request);
	String memNm 		= LoginSessionMisc.getMemNm(request)		== null ? "" : (String)LoginSessionMisc.getMemNm(request);	
	String memType 		= LoginSessionMisc.getMemType(request)		== null ? "" : (String)LoginSessionMisc.getMemType(request);
	String gigwanType 	= LoginSessionMisc.getGigwanType(request)	== null ? "" : (String)LoginSessionMisc.getGigwanType(request);
	String gigwanCd 	= LoginSessionMisc.getGigwanCd(request)		== null ? "" : (String)LoginSessionMisc.getGigwanCd(request);
	
	String pParam = "GIS top.jsp :::"
		+ "  memId >>>" + memId 
		+ ", memNm >>>" + memNm 
		+ ", memType >>>" + memType
		+ ", gigwanType >>>" + gigwanType
		+ ", gigwanCd >>>" + gigwanCd
		;
		
		System.out.println(pParam);
	%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
    <meta charset="UTF-8">

    <title>SGIS</title>

	<link rel="stylesheet" href="http://js.arcgis.com/3.14/dijit/themes/claro/claro.css">
	<link rel="stylesheet" href="http://js.arcgis.com/3.14/esri/css/esri.css">
	<link rel="stylesheet" href="custom.css">
	
    <!-- The line below must be kept intact for Sencha Cmd to build your application -->
    <script>
		//(function(){
			var baseUrl = 'http://' + window.location.hostname + ':' + window.location.port;
			
			dojoConfig = {
					packages: [{name: "Sgis", location: baseUrl+"/app"}]
			};
			//var memType = <%=memType%>;
			var memType = 7;
			window.memType = memType;
	    //});
	    
		
	</script>
    <script type="text/javascript" src="http://js.arcgis.com/3.14/"></script>
    <script type="text/javascript" src="./resources/js/common.js"></script>
    <script id="microloader" type="text/javascript" src="libs/jquery/jquery-1.11.3.min.js"></script>
    <script id="microloader" type="text/javascript" src="bootstrap.js"></script>
</head>
</html>