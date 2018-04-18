/*
 * This file is generated and updated by Sencha Cmd. You can edit this file as
 * needed for your application, but these edits will have to be merged by
 * Sencha Cmd when upgrading.
 */


var _API = null;

var store = Ext.create('Ext.data.Store', {
	autoLoad : true,

	fields : [ {
		name : 'MapserviceUrl'
	} ],

	proxy : {
		type : 'ajax',
		url : './resources/data/LayerMapper.json',
		reader : {
			type : 'json'
		}
	},

	listeners : {
		beforeload : function(a, b, c) {
			// //console.info(this.data.record);
			_testUrl = "sss";
		}
	}
});

store.load(function(a, b, c) {
	
	_API = a[0].data;
	
});

var proxy = './proxy/proxy.jsp?';
	
//지번 레이어 레전드 json 전역변수 설정
var _LCLlegend= null;
Ext.Ajax.request({
	url: proxy+"http://112.217.167.123:43002/arcgis/rest/services/LSMD_CONT_LDREG/MapServer/legend?f=pjson",
	async: true, 
	success : function(response, opts) {
		jsonData = Ext.util.JSON.decode( response.responseText );
		_LCLlegend = jsonData.layers;
	},
	failure: function(form, action) {
		alert("오류가 발생하였습니다.");
	}
});

Ext.application({
    name: 'Sgis',

    extend: 'Sgis.Application'/*,
    
    autoCreateViewport: 'Sgis.view.main.Main'*/
	
    //-------------------------------------------------------------------------
    // Most customizations should be made to Sgis.Application. If you need to
    // customize this file, doing so below this section reduces the likelihood
    // of merge conflicts when upgrading to new versions of Sencha Cmd.
    //-------------------------------------------------------------------------
});
