Ext.require('Cmm.view.LoadingPopup');

Ext.define('Cmm.mixin.Loading', function() {
	window.fuckBrowser = false;
	
	var _ua = navigator.userAgent;
    var rv = -1;
    var trident = _ua.match(/Trident\/(\d.\d)/i);
    if( trident != null ){
        if( trident[1] == "4.0" ) {
        	window.fuckBrowser = true;
        }
    }
     
    //IE 7...
    if( navigator.appName == 'Microsoft Internet Explorer' ) {
    	window.fuckBrowser = true;
    }
    
	window.XMLHttpRequest.prototype.customAbort = function(){
		if(this.readyState!=0 && this.readyState!=4){
			this.abort();
		}
	}
	
	if(!window.fuckBrowser){
		window.XMLHttpRequest.prototype._open = window.XMLHttpRequest.prototype.open;
		window.XMLHttpRequest.prototype.open = function(method,url,async){ 
			this._url = url;
			this._open(method,url,async);
		};
		
		var _orgXMLHttpRequest = window.XMLHttpRequest;
		window.XMLHttpRequest = function(){
			var obj = new _orgXMLHttpRequest();
			try{
				Sgis.getApplication().addListener('abortFinishMode', obj.customAbort, obj);
			}catch(e){}
			return obj;
		}
	}
	var _executeCount = 0;
	var _loadingPopup = null;
	
	function execute() {
		if(window.fuckBrowser || Sgis.getApplication().fuckBrowser){
			return;
		}
		_executeCount++;
		if(!_loadingPopup){
			_loadingPopup = Ext.create('Cmm.view.LoadingPopup');
		}
		Sgis.getApplication().fireEvent('executeMode', null);
		_loadingPopup.customShow();
	}
	
	function finish() {
		if(window.fuckBrowser || Sgis.getApplication().fuckBrowser){
			return;
		}
		if(_executeCount==0){
			_loadingPopup.customHide();
			return;
		}
		_executeCount--;
		if(_executeCount<=0){
			_loadingPopup.customHide();
			_executeCount == 0;
			Sgis.getApplication().fireEvent('finishMode', null);
		}	
	}

	function abortFinish() {
		if(window.fuckBrowser || Sgis.getApplication().fuckBrowser){
			return;
		}
		_executeCount == 0;
		Sgis.getApplication().fireEvent('abortFinishMode', null);
	}
	return {
		loading : {
			execute : execute,
			finish : finish,
			abortFinish : abortFinish
		}
	};
}());