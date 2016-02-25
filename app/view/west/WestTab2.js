Ext.define('Sgis.view.west.WestTab2', {
	
	extend: 'Ext.container.Container',
	
	requires: [
		'Sgis.view.west.WestTab2Controller'
	],

	xtype: 'app-west-tab2',

	controller: 'app-west-tab2',
	
	title: '자료검색',
	
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
			title: '지역검색',
			collapsed: false,
			items: [{
				xtype: 'form',
				padding: 10,
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				items: [{
					id: 'cmbArea1',
					itemId: 'cmbArea1',
					xtype: 'combo',
					fieldLabel: '시도',
					store: Ext.create('Sgis.store.Area1Store'),
					displayField: 'name',
					valueField: 'id'
				}, {
					id: 'cmbArea2',
					itemId: 'cmbArea2',
					xtype: 'combo',
					fieldLabel: '시군구',
					store: Ext.create('Sgis.store.Area2Store'),
					displayField: 'name',
					valueField: 'id',
					disabled: true
				}, {
					id: 'cmbArea3',
					itemId: 'cmbArea3',
					xtype: 'combo',
					fieldLabel: '읍면동',
					store: Ext.create('Sgis.store.Area3Store'),
					displayField: 'name',
					valueField: 'id',
					disabled: true
				}]
			}]
		}, {
			title: '영역검색',
			collapsed: false,
			id:'btnVBox',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			
			items: [{
				id:'btnHBox',
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				bodyPadding: 10,
				items: [{
					xtype: 'button',
					text: '원형',
					flex: 1,
					margin: '0 4 0 0',
					handler: 'onAreaCircleClick',
					enableToggle: true,
					toggleGroup: 'seachBtnGroup'
				}, {
					xtype: 'button',
					text: '사각형',
					flex: 1,
					margin: '0 4 0 0',
					handler: 'onAreaRectClick',
					enableToggle: true,
					toggleGroup: 'seachBtnGroup'
				}, {
					xtype: 'button',
					text: '다각형',
					flex: 1,
					margin: '0 4 0 0',
					handler: 'onAreaPolygonClick',
					enableToggle: true,
					toggleGroup: 'seachBtnGroup'
				}, {
					xtype: 'button',
					text: '반경',
					flex: 1,
					margin: '0 4 0 0',
					handler: 'onAreaRadiusClick',
					enableToggle: true,
					toggleGroup: 'seachBtnGroup'
				}]
			},{
				xtype: 'form',
				id:'radusForm',
				height:25,
				width: 100,
				hidden:true,
				margin: '0 8 0 0',
				defaultType: 'textfield',
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				items: [
					{
						fieldLabel: '&nbsp;&nbsp;&nbsp;&nbsp;반경입력(km)',
						id: 'radusVal',
						width:180
					},{
						xtype: 'button',
						id: 'pointBtn',
						text: '위치선택',
						enableToggle: true,
						margin: '0 4 0 4',
						handler: 'onAreaPointClick'
					}
				]
			}]
		}, {
			title: '레이어',
			collapsed: false,
			id:'layerTree2',
			//hideCollapseTool: true,
			xtype: 'treepanel',
			//controller: 'app-west-tab2',
			rootVisible: false,
			useArrows: true,
			//rowLines: true,
			bufferedRenderer: false/*,
			store : Ext.create('Sgis.store.Layer2TreeStore')*/
		}]
	}]

});