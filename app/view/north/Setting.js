Ext.define('Sgis.view.north.Setting', {
	
	extend : 'Ext.form.Panel',
	
	requires : ['Sgis.view.north.SettingController'],

	xtype : 'app-north-setting',
	
	controller: 'app-north-setting',

	title : '설정',
	
	frame : true,

	defaults : {
		margin : '10 10 10 10'
	},
		
	items : [ {
		xtype: 'fieldset',
		title: '설정 1',
		collapsible: true,
		layout: {
			type: 'vbox',
			align: 'stretch',
			padding: '4 0 4 0'
		},
		items: [{
			xtype : 'textfield',
			fieldLabel : '설정 1-1',
			name : 'setting-1-1',
			itemId : 'txt1_1'
		}, {
			xtype : 'textfield',
			fieldLabel : '설정 1-2',
			name : 'setting-1-2',
			itemId : 'txt1_2'
		}, {
			xtype : 'textfield',
			fieldLabel : '설정 1-3',
			name : 'setting-1-3',
			itemId : 'txt1_3'
		}]
	}, {
		xtype: 'fieldset',
		title: '설정 2',
		collapsible: true,
		layout: {
			type: 'vbox',
			align: 'stretch',
			padding: '4 0 4 0'
		},
		items: [{
			xtype : 'textfield',
			fieldLabel : '설정 2-1',
			name : 'setting-2-1',
			itemId : 'txt1_2'
		}]
	}],
	
	bbar: ['->', {
		id: 'btnSave',
		xtype: 'button',
		text: '저장',
		handler: 'onClickSave'
	}, {
		id: 'btnClose',
		xtype: 'button',
		text: '닫기',
		handler: 'onClickClose'
	}]
});