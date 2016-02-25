Ext.define('Sgis.view.north.North', {
	
	extend: 'Ext.panel.Panel',
	
	requires: ['Sgis.view.north.NorthController'],
	
	xtype: 'app-north',
	
	controller: 'app-north',
	
	padding: 10,
	
	height: 50,
	
	padding: 0,
	
	layout: {
		type: 'hbox',
		align: 'stretch'
	},
	
	items: [{
		xtype: 'image',
		width: 300,
		padding: '10 10 10 10',
		bind: {
			src: '{brand_image}'
		}
	}, {
		xtype: 'container',
		width: 200
	}, {
		xtype: 'container',
		flex: 1,
		layout: {
			type: 'vbox',
			align: 'stretch'
		},
		defaults: {
			border: 0,
			style: 'background-color:white;background-image:none;'
		},		
		items: [{
			xtype: 'toolbar',
			border: 0,
			flex: 1,
			items: [{
				xtype: 'button',
				text: '전체',
				handler: 'onClickAll',
				iconCls: 'menu_overview'
			},  {
				xtype: 'button',
				text: '이전',
				handler: 'onClickPrev',
				iconCls: 'menu_prev'
			}, {
				xtype: 'button',
				text: '다음',
				handler: 'onClickNext',
				iconCls: 'menu_next'
			}, {
				xtype: 'button',
				text: '측정',
				handler: 'onClickMeasure',
				iconCls: 'menu_measure'
			}, {
				xtype: 'button',
				text: '인쇄',
				handler: 'onClickPrint',
				iconCls: 'menu_print'
			}, {
				xtype: 'button',
				text: '저장',
				handler: 'onClickSave',
				iconCls: 'menu_save',
				hidden: true
			}, {
				xtype: 'button',
				text: '흑백',
				handler: 'onClickGray',
				enableToggle: true,
				iconCls: 'menu_gray',
				id:'grayBtn',
				hidden: true
			},'->', {
				id: 'mapmode',
				xtype: 'cycle',
				showText: true,
				menu : {
					items: [{
						text: '위성',
						checked: true
					}, {
						text: '단색'
					}]
				},
				handler: 'onClickMapMode',
				hidden: true
			}, '->', {
				xtype: 'button',
				text: '설정',
				handler: 'onClickSetting',
				iconCls: 'menu_setting',
				hidden: true
			}, '->', {
				xtype: 'label',
				id:'currUmdLabel',
				text:''
			}]
		}]
	}]
  
});