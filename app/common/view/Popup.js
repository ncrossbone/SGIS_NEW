Ext.define('Cmm.view.Popup', {
	
	extend : 'Ext.window.Window',

	xtype : 'popup',
		
	autoScroll : true,
	
	layout : 'fit',
	
	width : 786,
	
	height : 512,
	
	closeOnClickMask : false,
		
	getParams : function() {
		return this._params;
	},

	setParams : function(params) {
		this._params = params;
		
		this.fireEvent('paramschange', this, params);
	},
	
	initComponent : function() {
		this.callParent();

		this.on('afterrender', function(popup) {
			var focusable = popup.down('field:focusable:first');
			if(focusable)
				focusable.focus(true, 500);
		});
	}
});