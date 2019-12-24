/**
* LayerDynamicGridController
*/
Ext.define('Sgis.view.south.LayerDynamicGridController', {
	
	extend: 'Ext.app.ViewController',
	
	alias: 'controller.layer_dynamic_grid',
	
	control: {
		'layer_dynamic_grid' : {
			itemclick: 'dataGridSelect'
		},
		'toolbar cycle': {
			change: 'reloadGrid'
		}
	},
	
	constructor: function() {
		this.callParent();
		Sgis.getApplication().addListener('searchParamChangeCallback', this.searchParamChangeCallbackeHandler, this);
	},
	
	reloadGrid: function(btn) {
		if(btn.itemId == 'btnCountPerPage') {
			var pageSize = btn.getText();
			pageSize = parseInt(pageSize);
			this.getView().getStore().setPageSize(pageSize);
			this.getView().getStore().load();
			
		} else {
			var toolbar = this.getView().down(' toolbar');
			var items = toolbar.items.items;
			var params = {};

			Ext.Array.each(items, function(item) {
				if(item.xtype == 'cycle' && item.itemId != 'btnCountPerPage') {
					params[item.itemId] = item.text;
				}
			});

			var layerId = this.getView().layerId;
			Sgis.getApplication().fireEvent('searchParamChange', layerId, params); 
		}
	},
	
	dataGridSelect: function(grid, record, item, index, e, eOpts) {
		Sgis.getApplication().fireEvent('dataGridSelect', this.getView().layerId, record);
	},

	setYear: function(a,b,c,d){
		
	},
	
	exportExcel: function(button, event, eOpts) {
		var me = this;
		var layerId = this.getView().layerId;
		if(button.text=='액셀받기'){
			button.setText("액셀받기취소");
			console.info(me.getView());
			var obj = {'header':JSON.stringify(me.getView().gridFields), 'headerNm':JSON.stringify(me.getView().gridFieldsKo), 'datas':JSON.stringify(me.getView().gridData)};
			$.post(_API.excelDownUrl, obj, function(data){
				button.setText("액셀받기");
				
				var downloadUrl = data.url;
				var a = document.createElement("a");
				a.href = downloadUrl;
				$(a).attr('download', 'excel');
				document.body.appendChild(a);
				a.click();
				
				/*
				$('#__fileDownloadIframe__').remove();
				$('body').append('<iframe src='+data.url+' id="__fileDownloadIframe__" name="__fileDownloadIframe__" width="0" height="0" style="display:none;"/>');
				*/
	   		},"json").error(function(){
	   			button.setText("액셀받기");
	   		});
		}else{
			Sgis.getApplication().fireEvent('abortFinishMode', null);
			button.setText("액셀받기");
		}
	},
	
	onBranchDetail: function(button, event, eOpts) {
		var record = button.getWidgetRecord();
		//SGIS.msg.alert('지점상세보기 : OBJECTID : ' + record.get('OBJECTID'));
		SGIS.popup('Sgis.view.south.popup.BranchInfoPopup', {layerId:this.getView().layerId, layerName:this.getView().title, record:record});
	},
	
	onWellDetail: function(button, event, eOpts) {
		var record = button.getWidgetRecord();
		SGIS.msg.alert('관정보기 : OBJECTID : ' + record.get('OBJECTID'));
	},
	
	searchParamChangeCallbackeHandler:function(reData){
		this.getView().createDynamicStore(null, reData);
	}
});
