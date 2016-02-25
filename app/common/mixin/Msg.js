Ext.define('Cmm.mixin.Msg', function() {
	
	function confirm(config) {
		Ext.applyIf(config, {
			title : 'Confirm',
			buttons : Ext.MessageBox.YESNO,
			modal : true,
			minWidth : 350,
			minHeight : 160
		});
		Ext.Msg.show(config);
	}

	function alert(config) {
		if(Ext.isString(config)) {
			config = {
				msg : config
			}
		}
		
		Ext.applyIf(config, {
			title : 'Alert',
			buttons : Ext.MessageBox.OK,
			modal : true,
			minWidth : 350,
			minHeight : 160
		});
		Ext.Msg.show(config);
	}

	function notice(config) {
		if(Ext.isString(config)) {
			config = {
				msg : config
			}
		}
		
		Ext.applyIf(config, {
			title : 'Notice',
			buttons : Ext.MessageBox.OK,
			modal : true,
			minWidth : 350,
			minHeight : 160,
			icon: Ext.window.MessageBox.ERROR
		});
		Ext.Msg.show(config);
	}

	function success(config) {
		if(Ext.isString(config)) {
			config = {
				msg : config
			}
		}
		
		Ext.applyIf(config, {
			title : 'Success',
			buttons : Ext.MessageBox.OK,
			modal : true,
			minWidth : 350,
			minHeight : 160,
			icon: Ext.window.MessageBox.ERROR
		});
		Ext.Msg.show(config);
	}

	function failure(config) {
		if(Ext.isString(config)) {
			config = {
				msg : config
			}
		}
		
		Ext.applyIf(config, {
			title : 'Failure',
			buttons : Ext.MessageBox.OK,
			modal : true,
			minWidth : 350,
			minHeight : 160,
			icon: Ext.window.MessageBox.ERROR
		});
		Ext.Msg.show(config);
	}
	
	function tip(config, by, position, offset) {
		Ext.defer(function() {
			if(Ext.isString(config)) {
				config = {
					html : config
				}
			}
		
			Ext.applyIf(config, {
				xtype : 'window',
				header : false
			});
		
			var tip = Ext.widget(config).showBy(by, position || 'tl-bl?', offset || [10, 10]);
		
			Ext.defer(function() {
				tip.close();
			}, 10000);
		}, 500);
	}

	return {
		msg : {
			alert : alert,
			confirm : confirm,
			success : success,
			notice : notice,
			failure : failure,
			tip : tip
		}
	};
}());