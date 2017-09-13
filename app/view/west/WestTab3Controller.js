/**
* West Tab2 Controller
*/
Ext.define('Sgis.view.west.WestTab3Controller', {
	
	extend: 'Ext.app.ViewController',
	
	//requires: ['Sgis.view.south.LayerDynamicGrid'],
	
	alias: 'controller.app-west-tab3',
	
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
		}
	},
	
	constructor: function(map) {
		var me = this;
		me.callParent();
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
		var view4 = Ext.getCmp('cmbJibun4')
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
		
		view4.reset();
		
	},
	
	onJibun4Change: function(combo, record, eOpts){
	},
	
	onJibunSearch: function(a,b,c){
		//시도 시군구 읍면동
		if(Ext.getCmp('cmbJibun3').getValue() == null){
			alert("최소 읍면동 선택 필요");
			return;
		}else{
			if(Ext.getCmp('bonCode').getValue() == ""){
				alert("본번을 입력해 주시기 바랍니다");
				return;
			}
		}
		
		var admCd = null;
		var inre = true;
		
		if(Ext.getCmp('cmbJibun4').getValue() == null){
			admCd = Ext.getCmp('cmbJibun3').getValue().substring(0,8);
			inre = false;
		}else{
			admCd = Ext.getCmp('cmbJibun4').getValue().substring(0,10);
			inre = true;
		}
		
		
		//산
		var sanCd = Ext.getCmp('mountCode').getValue() ? 2 : 1;
		
		//본번
		var bonCd = Ext.getCmp('bonCode').getValue();
		bonCd = bonCd + '';
		bonCd = bonCd.length >= 4 ? bonCd : new Array(4 - bonCd.length + 1).join('0') + bonCd ;
		
		//부번
		var buCd = Ext.getCmp('buCode').getValue();
		buCd = buCd + '';
		buCd = buCd.length >= 4 ? buCd : new Array(4 - buCd.length + 1).join('0') + buCd ;
		
		
		
		var store = Ext.create('Sgis.store.JibunSearchStore');
		store.admCd = admCd;
		store.sanCd = sanCd;
		store.bonCd = bonCd;
		store.buCd = buCd;
		store.inre = inre;
		store.load();
		
		
	}
});
