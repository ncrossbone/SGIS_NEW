Ext.define('Sgis.view.west.WestTab3', {
	
	extend: 'Ext.container.Container',
	
	requires: [
		'Sgis.view.west.WestTab3Controller'
	],

	xtype: 'app-west-tab3',

	controller: 'app-west-tab3',
	
	title: '지번이동',
	
	autoScroll: true,
	
	bodyPadding: 10,
	
	layout: {
		type: 'vbox',
		align: 'stretch'
	},
	
	items: [{
		xtype: 'panel',
		layout: {
			type: 'accordion',
			animate: true,
			multi: true
		},
		items: [{
			title: '지역이동',
			collapsed: false,
			items: [{
				xtype: 'form',
				padding: 10,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [{
					id: 'cmbJibun1',
					itemId: 'cmbJibun1',
					xtype: 'combo',
					fieldLabel: '시도',
					store: Ext.create('Sgis.store.Jibun1Store'),
					displayField: 'name',
					valueField: 'id'
				}, {
					id: 'cmbJibun2',
					itemId: 'cmbJibun2',
					xtype: 'combo',
					fieldLabel: '시군구',
					store: Ext.create('Sgis.store.Jibun2Store'),
					disabled: true,
					displayField: 'name',
					valueField: 'id',
				}, {
					id: 'cmbJibun3',
					itemId: 'cmbJibun3',
					xtype: 'combo',
					fieldLabel: '읍면동',
					store: Ext.create('Sgis.store.Jibun3Store'),
					disabled: true,
					displayField: 'name',
					valueField: 'id',
				}, {
					id: 'cmbJibun4',
					itemId: 'cmbJibun4',
					xtype: 'combo',
					fieldLabel: '동리',
					store: Ext.create('Sgis.store.Jibun4Store'),
					disabled: true,
					displayField: 'name',
					valueField: 'id',
				},{
					xtype: 'form',
					layeout: {
						type: 'hbox'
					},
					items:[{
						xtype: 'checkbox',
						id: 'mountCode',
						boxLabel: '산'
					},{
						xtype: 'textfield',
						id: 'bonCode',
						width: '250px',
						fieldLabel: '본번'
					},{
						xtype: 'textfield',
						id: 'buCode',
						width: '250px',
						fieldLabel: '부번'
					}]
				}, {
					xtype: 'button',
					id: 'searchJibun',
					itemId: 'searchJibun',
					text: '지번검색'
				}]
			}]
		},{
			xtype: 'west-tab3-result-list'
		}]
	}]

});