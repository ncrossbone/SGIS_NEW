<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
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
    alert("dd");
		(function(){
			var baseUrl = 'http://' + window.location.hostname + ':' + window.location.port;
			dojoConfig = {
					packages: [{name: "Sgis", location: baseUrl+"/app"}]
			};
	    })();
		
	</script>
    <script type="text/javascript" src="http://js.arcgis.com/3.14/"></script>
    <script id="microloader" type="text/javascript" src="libs/jquery/jquery-1.11.3.min.js"></script>
    <script id="microloader" type="text/javascript" src="bootstrap.js"></script>
</head>
<body id="_gooBody_">
	<div id="_loadingDiv_">
		<center style="margin-top: 0px;"><img src="resources/images/arcgis.png"/><img src="resources/images/sencha-logo.png"/></center>
		<center style="margin-top: 10px;"><img src="resources/images/senchaLoading.gif"/></center>
		<center style="margin-top: 10px;"><img src="resources/images/site_brand.png"/></center>
	</div>
</body>
</html>