Ext.define('Sgis.view.west.WestTab2', {
	
	extend: 'Ext.container.Container',
	
	requires: [
		'Sgis.view.west.WestTab2Controller',
		'Sgis.view.west.WestTab3Controller'
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
					store: Ext.create('Sgis.store.Jibun1Store'),
					displayField: 'name',
					valueField: 'id'
				}, {
					id: 'cmbArea2',
					itemId: 'cmbArea2',
					xtype: 'combo',
					fieldLabel: '시군구',
					store: Ext.create('Sgis.store.Jibun2Store'),
					displayField: 'name',
					valueField: 'id',
					disabled: true
				}, {
					id: 'cmbArea3',
					itemId: 'cmbArea3',
					xtype: 'combo',
					fieldLabel: '읍면동',
					store: Ext.create('Sgis.store.Jibun3Store'),
					displayField: 'name',
					valueField: 'id',
					disabled: true
					
				}, {
					id: 'cmbArea4',
					itemId: 'cmbArea4',
					xtype: 'combo',
					fieldLabel: '동리',
					store: Ext.create('Sgis.store.Jibun4Store'),
					displayField: 'name',
					valueField: 'id',
					disabled: true,
					listeners : {
						afterrender : function(){
							console.info();
							if(location.href == "http://localhost:8080/GIS/index.jsp"){
								this.setHidden(true);
							}
						}
					}
				}, {
					xtype: 'form',
					layout: {
						type: 'hbox',
						align: 'stretch'
					},
					items:[{
						xtype: 'label',
						text: '지번'
					},{
						xtype: 'panel',
						width: 37
					},{
						xtype: 'checkbox',
						id: 'mountCode',
						boxLabel: '산'
					},{
						xtype: 'panel',
						width: 9
					},{
						xtype: 'textfield',
						id: 'ziBunCode',
						width: '133px'
					}],
					listeners : {
						afterrender : function(){
							console.info();
							//if(location.href == "http://localhost:8080/GIS/index.jsp"){
							if(location.href.substr(7,7) != "/sgisin"){
								this.setHidden(true);
							}
						}
					}
				}, {
					xtype: 'button',
					id: 'searchJibun',
					itemId: 'searchJibun',
					text: '지번검색',
					listeners : {
						afterrender : function(){
							console.info();
							//if(location.href == "http://localhost:8080/GIS/index.jsp"){
							if(location.href.substr(7,7) != "/sgisin"){
								this.setHidden(true);
							}
						}
					}
				}]
				/*items: [{
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
						id: 'ziBunCode',
						width: '250px',
						fieldLabel: '지번'
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
				}]*/
			}]
		},{
			title: '검색결과',
			hidden: true,
			id:'btnSResult',
			autoScroll:true,
			autoHeight: true,
			height: 200,
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			items: [{
				xtype : 'grid',
				id: 'SResultGrid',
				hideHeaders: true,
				store : Ext.create('Sgis.store.JibunSearchStore'),
				columns : [{ 
					dataIndex : 'addr',
					width: 250
				}],
				listeners:{
					rowclick: function(g,index,ev){
						
						JibunMove(index.data.id,index.data.layerNum);
						
					}
				}
			}]
		},{
			title: '지점검색으로 부터 반경검색',
			hidden: true,
			collapsed: false,
			id:'btnSRBox',
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			
			items: [{
				id:'btnSRHBox',
				layout: {
					type: 'hbox',
					align: 'stretch'
				},
				bodyPadding: 10,
				items: [{
					xtype: 'button',
					text: '100M',
					value: '100',
					pressed: true,
					flex: 1,
					margin: '0 4 0 0',
					handler: 'bufferBtn',
					enableToggle: true,
					toggleGroup: 'bufferBtnGroup'
				}, {
					xtype: 'button',
					text: '130M',
					value: '130',
					flex: 1,
					margin: '0 4 0 0',
					handler: 'bufferBtn',
					enableToggle: true,
					toggleGroup: 'bufferBtnGroup'
				}, {
					xtype: 'button',
					text: '150M',
					value: '150',
					flex: 1,
					margin: '0 4 0 0',
					handler: 'bufferBtn',
					enableToggle: true,
					toggleGroup: 'bufferBtnGroup'
				}, {
					xtype: 'button',
					id: 'inputBuffer',
					text: '직접입력',
					flex: 1,
					margin: '0 4 0 0',
					handler: 'bufferBtn',
					enableToggle: true,
					toggleGroup: 'bufferBtnGroup'
				}]
			},{
				xtype: 'form',
				id:'sRradusForm',
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
						fieldLabel: '&nbsp;&nbsp;&nbsp;&nbsp;반경입력(m)',
						id: 'sRradusVal',
						width:180
					},{
						xtype: 'button',
						id: 'inputBufferCon',
						text: '선택',
						margin: '0 4 0 4',
						handler: 'bufferBtn'
					}
				]
			}]
		},{
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