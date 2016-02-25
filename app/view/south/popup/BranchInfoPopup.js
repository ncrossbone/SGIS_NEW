Ext.define('Sgis.view.south.popup.BranchInfoPopup', {
	extend: 'Cmm.view.Popup',
	xtype: 'sourth_branch_info',
	
	controller : 'sourth_branch_info',
	
	requires : [
	            'Sgis.view.south.popup.InfoResult',
	    		'Ext.chart.*'
	    		],
	title: 'none',
	
	height: 715,
	width: 856,
	
	makeChild:function(){
		this.setTitle(this._params.layerName);
		this.add({
			xtype : 'tabpanel',
			items: [{
				title: '지점정보',
				xtype:'sourth_branch_infoResult',
				params: this._params
			},{
				title: '상세정보',
				xtype:'sourth_detail_infoResult',
				params: this._params
			},{
				title: '측정정보',
				xtype:'sourth_branch_measureResult',
				params: this._params
			}]
		});
	}
});
