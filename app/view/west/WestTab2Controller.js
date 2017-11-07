/**
* West Tab2 Controller
*/
Ext.define('Sgis.view.west.WestTab2Controller', {
	
	extend: 'Ext.app.ViewController',
	
	requires: ['Sgis.view.south.LayerDynamicGrid'],
	
	alias: 'controller.app-west-tab2',
	
	control: {
		
		'#cmbJibun1': {
			select: 'onJibun1Change'
		},
		'#cmbJibun2': {
			select: 'onJibun2Change'
		},
		'#cmbJibun3': {
			select: 'onJibun3Change'
		},
		'#cmbJibun4': {
			select: 'onJibun4Change'
		},
		'#searchJibun':{
			click: 'onJibunSearch'
		},
		
		'#cmbArea1': {
			select: 'onArea1Change'
		},
		'#cmbArea2': {
			select: 'onArea2Change'
		},
		'#cmbArea3': {
			select: 'onArea3Change'
		},
		'treepanel': {
			checkchange: 'onCheckChanged',
			afterrender: 'onAfterrender'
		}		
	},
	
	constructor: function(map) {
		var me = this;
		me.callParent();
		Sgis.getApplication().addListener('drawComplte', me.drawComplteHandler, me);
    },
    
    
    
    
    
    
    onJibun1Change: function(combo, record, eOpts) {
		var view2 = Ext.getCmp('cmbJibun2');
		var view3 = Ext.getCmp('cmbJibun3')
		var store2 = view2.getStore();
		store2.clearFilter();
		store2.filter(function(item){
			if(item.id=='_cancel_'){
				return true;
			}
			return (item.id+"").substring(0,2) == record.data.id.substring(0,2);
		})		
		view2.reset();
		view2.setDisabled(false);
		view3.setDisabled(true);
	},
	
	onJibun2Change: function(combo, record, eOpts) {
		var view3 = Ext.getCmp('cmbJibun3')
		var store3 = view3.getStore();
		var admCd = record.data.id;
		
		if(admCd!='_cancel_'){
			view3.setDisabled(false);
		}else{
			admCd = Ext.getCmp('cmbJibun1').getSelection().data.id;
			view3.setDisabled(true);
		}
		
		store3.clearFilter();
		store3.filter(function(item){
			try{
				if(item.id=='_cancel_'){
					return true;
				}
				return (item.id+"").substring(0,4) == record.data.id.substring(0,4);
			}catch(e){
				return false;
			}
			
		})
		
		view3.reset();
	},
	
	onJibun3Change: function(combo, record, eOpts) {
		/*var view4 = Ext.getCmp('cmbJibun4')
		var store4 = view4.getStore();
		var admCd = record.data.id;
		if(admCd!='_cancel_'){
			view4.setDisabled(false);
		}else{
			admCd = Ext.getCmp('cmbArea2').getSelection().data.id;
			view4.setDisabled(true);
		}
		
		store4.clearFilter();		
		store4.filter(function(item){
			try{
				if(item.id=='_cancel_'){
					return true;
				}
				return (item.id+"").substring(0,7) == record.data.id.substring(0,7);
			}catch(e){
				return false;
			}
			
		})
		
		view4.reset();*/
		
	},
	
	onJibun4Change: function(combo, record, eOpts){
		
	},
	
	//지점검색으로 부터 반경검색 select 박스 클릭
	bufferBtn: function(button,e){
		
		//반경입력창 hidden/hide
		if(button.id == "inputBuffer" || button.id == "inputBufferCon"){
			Ext.getCmp("sRradusForm").setHidden(false);
			if(button.id == "inputBuffer"){
				return;
			}	
		}else{
			Ext.getCmp("sRradusForm").setHidden(true);
		}
		
		
		if(Ext.getCmp("SResultGrid").getSelectionModel().lastSelected != undefined){
			JibunMove(Ext.getCmp("SResultGrid").getSelectionModel().lastSelected.data.id, Ext.getCmp("SResultGrid").getSelectionModel().lastSelected.data.layerNum);
		}else{
			return;
		}
		
		
	},
	
	onJibunSearch: function(a,b,c){
		//시도 시군구 읍면동
		if(Ext.getCmp('cmbArea3').getValue() == null){
			alert("최소 읍면동 선택 필요");
			return;
		}else{
			if(Ext.getCmp('ziBunCode').getValue() == ""){
				alert("본번을 입력해 주시기 바랍니다");
				return;
			}
		}
		
		var admCd = null;
		if(Ext.getCmp('cmbArea3').getValue() != null){
			admCd = Ext.getCmp('cmbArea3').getValue().toString().substring(0,8);	
		}else{
			return;
		}
		
		//산
		var sanCd = Ext.getCmp('mountCode').getValue() ? 2 : 1;		
		
		//ziBunCode
		var ziBunCode = Ext.getCmp('ziBunCode').getValue();
		
		var inbu = false;
		
		if(ziBunCode.indexOf("-") > -1){
			inbu = true;
		}
		
		
		var bonCd = null;  //본번
		var buCd = null;   //부번
		if(inbu){
			//본번
			bonCd = ziBunCode.substring(0,ziBunCode.indexOf("-"));
			bonCd = bonCd + '';
			bonCd = bonCd.length >= 4 ? bonCd : new Array(4 - bonCd.length + 1).join('0') + bonCd ;
			//부번
			buCd = ziBunCode.substring(ziBunCode.indexOf("-")+1,ziBunCode.length);
			buCd = buCd + '';
			buCd = buCd.length >= 4 ? buCd : new Array(4 - buCd.length + 1).join('0') + buCd ;
		}else{
			bonCd = ziBunCode;
			bonCd = bonCd + '';
			bonCd = bonCd.length >= 4 ? bonCd : new Array(4 - bonCd.length + 1).join('0') + bonCd ;
		}
		
		var store = Ext.create('Sgis.store.JibunSearchStore');
		store.admCd = admCd;	//지점코드
		store.sanCd = sanCd;	//산
		store.bonCd = bonCd;	//본번
		store.buCd = buCd;	//부번
		store.inbu = inbu;	//부번 체크
		store.load();
		
		
		Ext.defer(function(){
			var SResultGrid = Ext.getCmp("SResultGrid");
			
			SResultGrid.setStore(store);
		}, 100);
		
		
	},
    
	
	onArea1Change: function(combo, record, eOpts) {
		Sgis.getApplication().fireEvent('areaSelect', {admCd:record.data.id, layerId:'15'});//시도
		var view2 = Ext.getCmp('cmbArea2');
		var view3 = Ext.getCmp('cmbArea3')
		var store2 = view2.getStore();
		store2.clearFilter();
		store2.filter(function(item){
			if(item.id=='_cancel_'){
				return true;
			}
			return (item.id+"").substring(0,2) == record.data.id;
		})		
		view2.reset();
		view2.setDisabled(false);
		view3.setDisabled(true);
	},
	
	onArea2Change: function(combo, record, eOpts) {
		var view3 = Ext.getCmp('cmbArea3')
		var store3 = view3.getStore();
		var admCd = record.data.id;
		if(admCd!='_cancel_'){
			Sgis.getApplication().fireEvent('areaSelect', {admCd:record.data.id, layerId:'16'});//시군구
			view3.setDisabled(false);
		}else{
			admCd = Ext.getCmp('cmbArea1').getSelection().data.id;
			Sgis.getApplication().fireEvent('areaSelect', {admCd:admCd, layerId:'15'});//시도
			view3.setDisabled(true);
		}
		
		store3.clearFilter();
		store3.filter(function(item){
			try{
				if(item.id=='_cancel_'){
					return true;
				}
				return (item.id+"").substring(0,4) == record.data.id.substring(0,4);
			}catch(e){
				return false;
			}
			
		})
		
		view3.reset();
	},
	
	onArea3Change: function(combo, record, eOpts) {
		
		var admCd = record.data.id;
		if(admCd!='_cancel_'){
			Sgis.getApplication().fireEvent('areaSelect', {admCd:admCd, layerId:'17'});//읍면동
		}else{
			admCd = Ext.getCmp('cmbArea2').getSelection().data.id;
			Sgis.getApplication().fireEvent('areaSelect', {admCd:admCd, layerId:'16'});//시군구
		}
	},

	onAreaCircleClick: function(button, e) {
		Ext.getCmp('radusForm').hide();
		Sgis.getApplication().fireEvent('searchBtnClick', {drawType:'CIRCLE', state:button.pressed});
	},
	
	onAreaRectClick: function(button, e) {
		Ext.getCmp('radusForm').hide();
		Sgis.getApplication().fireEvent('searchBtnClick', {drawType:'EXTENT', state:button.pressed});
	},
	
	onAreaPolygonClick: function(button, e) {
		Ext.getCmp('radusForm').hide();
		Sgis.getApplication().fireEvent('searchBtnClick', {drawType:'POLYGON', state:button.pressed});
	},
	
	onAreaRadiusClick: function(button, e) {
		if(button.pressed){
			Ext.getCmp('radusForm').show();
		}else{
			Ext.getCmp('radusForm').hide();
		}
	},
	
	onAreaPointClick: function(button, e) {
		var radus  = Ext.getCmp('radusVal').getValue();
		if(!radus){
			Ext.getCmp('radusVal').setValue(3);
			radus  = 3;
		}
		if(button.pressed){
			Ext.getCmp('radusVal').setDisabled(true);
		}else{
			Ext.getCmp('radusVal').setDisabled(false);
		}
			
		Sgis.getApplication().fireEvent('searchBtnClick', {drawType:'POINT', state:button.pressed, radus:radus});
	},
	
	drawComplteHandler: function(){
		var btnAr  = Ext.getCmp('btnHBox').items.items;
		Ext.each(btnAr, function(btn, index) {
			btn.setPressed(false);
		});
		Ext.getCmp('radusForm').hide();
		Ext.getCmp('pointBtn').setPressed(false);
		Ext.getCmp('radusVal').setDisabled(false);
	},
	
	onCheckChanged: function(node, checked, eOpts) {
		
		
		if(!node.get('leaf')) {
			this.checkAllChildren(node, checked);
		} else {
			var view = Ext.getCmp("layerTree2");
			if(view.xtype == 'treepanel') {
				Sgis.getApplication().fireEvent('searchLayerOnOff', view.getChecked());
				this.searchLayerData(node, checked);
			}
		}
	},
	
	checkAllChildren: function(node, checked) {		
		var me = this;
		var children = node.childNodes;
		
		Ext.each(children, function(child, index) {
			
			//3dep 일시
			if(child.childNodes.length > 0){
				for(var cNods = 0 ; cNods < child.childNodes.length ; cNods++ ){
						child.childNodes[cNods].set('checked', checked);
				}	
			}
			child.set('checked', checked);
			if(index==children.length-1){
				var view = Ext.getCmp("layerTree2");
				Sgis.getApplication().fireEvent('searchLayerOnOff', view.getChecked());
			}
			/*if(child.childNodes.length > 0){
				for(var cNods = 0 ; cNods < child.childNodes.length ; cNods++ ){
						child.childNodes[cNods].set('checked', checked);
				}	
			}
			
			if(index == children.length - 1) {
				var view = Ext.getCmp("layerTree2");
				if(view.xtype == 'treepanel') {
					Sgis.getApplication().fireEvent('searchLayerOnOff', view.getChecked());
				}
			}*/
		});
	},
	
	searchLayerData: function(node, checked) {
		var nodeIdStr = node.get('id');
		var nodeId = parseInt(nodeIdStr);
		
		if(!isNaN(nodeId)) {
			var viewName = 'Sgis.view.south.LayerDynamicGrid';
			if(checked) {
				SGIS.addSearchGrid(viewName, { node : node }, { layerId : nodeIdStr, title : node.get('text') });
			} else {
				SGIS.removeSearchGrid(nodeIdStr);
			}
		}
	},
	onAfterrender:function(){
		//http://localhost:8088/sgis/index.html?layer=A1
				var me = this;
				var view = Ext.getCmp("layerTree2");
				//var store = view.getStore();
				var store = Ext.create('Sgis.store.Layer2TreeStore');
				var timerId = window.setInterval(function(){
					var test = store.findRecord('id', '1'); //로딩되었는지 검사하려고
					if(test){
						window.clearInterval(timerId);
						//test.set('checked', true);
							var layerAuth = Sgis.app.memType;
							if(layerAuth==6 || layerAuth==7){
								layerArr = [1,2,3,4,42,6,7,9,10,11,13,14,15,16,18,19,20,23,24,25,27,30,31,32,33,34,35,36,37,38,39,40,43]
							}else if(layerAuth=="20"){
								layerArr = [18,19,20,23,24,25,27,30,31,32,33,34,35,36,37,38,39]
							}else if(layerAuth==31){
								layerArr = [1,2,3,4,42,6,8,9,10,11,13,14,15]
							}else if(layerAuth==2 || layerAuth==5 || layerAuth==31 || layerAuth==40){
								layerArr = [1,2,3,4,42,6,8,9,11,13,14,15]
							}else if(layerAuth==13){
								layerArr = [1,2,3,4,42,11,13,14,15]
							}else if(layerAuth==3 || layerAuth==8 || layerAuth==32){
								layerArr = [1,2,3,4,42,6,8,9,11,13,14,15,20]
							}else{
								if(location.href.substr(7,3) == "10."){
									layerArr = []
								}else{
									layerArr = [1,2,3,4,11,13,14,15]
								}
							}
							for(var i=0; i<layerArr.length; i++){
								var record = store.findRecord('id', layerArr[i]);
								if(record){
									record.set('extSel', true);
								}
							}
							
							for(var i=1; i<43; i++){
								var record = store.findRecord('id', i);
								if(record && !record.get('extSel')){
									record.drop();
								}
							}
							
							
							for(var j=1 ; j<4 ; j++){
								if(store.findRecord('id', "p"+j) == null){
									return;
								}else if(store.findRecord('id', "p"+j).childNodes.length==0){
									store.findRecord('id', "p"+j).drop();
								}
							}

							
							if(store.findRecord('id', "p4_2") == null){
								return;
							}else if(store.findRecord('id', "p4_2").childNodes.length==0){
								store.findRecord('id', "p4_2").drop();
							}
							
							if(store.findRecord('id', "p4").childNodes.length==0){
								store.findRecord('id', "p4").drop();
							}
							
							Ext.getCmp("layerTree2").setVisible(true);
							Ext.getCmp("layerTree3").setVisible(true);
							view.setStore(store);
					}
				}, 500);
			}
});
