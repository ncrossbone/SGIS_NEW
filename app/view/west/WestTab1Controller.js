/**
* West Tab1 Tree Controller
*/
Ext.define('Sgis.view.west.WestTab1Controller', {
	
	extend: 'Ext.app.ViewController',

	alias: 'controller.app-west-tab1',

	control: {
		'treepanel': {
			checkchange: 'onCheckChanged',
			afterrender: 'onAfterrender'
		}
	},
	
	onCheckChanged: function(node, checked, eOpts) {
		
		// p = 레이어  / b = 주제도
		if(node.data.parentId.substr(0,1) == "p"){
			if(!node.get('leaf')) {
				if(node.data.parentId.substr(0,3) == "p1_"){
					if(node.data.children != null){
						if(checked == true){
							node.expand();
						}else{
							node.collapse();
						}
						
					}
				}else{
					this.checkAllChildren(node, checked);
				}
				
			}else{
				Sgis.getApplication().fireEvent('dynamicLayerOnOff', this.getView().getChecked());
			}



			
		}else if(node.data.parentId.substr(0,1) == "b"){
			

			//
			if(node.data.parentId == 'b4' || node.data.parentId == 'b6'){

				var nodeCheck = false;

				if(checked == true){

					console.info(node);

					node.parentNode.parentNode.childNodes.map(function(treeObj){
						if(treeObj.data.id == 'b4' || treeObj.data.id == 'b6'){
							treeObj.childNodes.map(function(childObj){
								if(childObj.id != node.data.id){
									if(childObj.data.checked == true){
										nodeCheck = true;
										node.set('checked', false);
									}
								}
							})
						}
					})

				}

				if(nodeCheck){
					alert('질산성 질소 데이터는 하나만 표출 가능합니다.')
					return;
				}

				var b4Combo = Ext.getCmp('b4Combo');

				var store;
				if(node.data.parentId == 'b4'){
					store = Ext.create('Ext.data.Store', {
						data: [
							{ name:'2011', id:'20'},
							{ name:'2012', id:'21'},
							{ name:'2013', id:'22'},
							{ name:'2014', id:'23'},
							{ name:'2015', id:'24'},
							{ name:'2016', id:'25'},
							{ name:'2017', id:'26'},
							{ name:'2018', id:'27'}
						],
						fields: ['name', 'id']
					});
				}else if(node.data.parentId == 'b6'){

					if(node.data.id == 'avg'){
						store = Ext.create('Ext.data.Store', {
							data: [
								{ name:'2012', id:'34'},
								{ name:'2013', id:'35'},
								{ name:'2014', id:'36'},
								{ name:'2015', id:'37'},
								{ name:'2016', id:'38'},
								{ name:'2017', id:'39'}
							],
							fields: ['name', 'id']
						});
					}else if(node.data.id == 'tile'){
						store = Ext.create('Ext.data.Store', {
							data: [
								{ name:'2012', id:'41'},
								{ name:'2013', id:'42'},
								{ name:'2014', id:'43'},
								{ name:'2015', id:'44'},
								{ name:'2016', id:'45'},
								{ name:'2017', id:'46'}
							],
							fields: ['name', 'id']
						});
					}

					
				}

				b4Combo.setStore(store);

				//범례
				if(node.data.children != null){
					if(checked == true){
						node.expand();
						b4Combo.setHidden(false);
					}else{
						node.collapse();
						b4Combo.setHidden(true);
						b4Combo.setValue('');
						Sgis.getApplication().fireEvent('dynamicLayer2OnOff2', null);
					}
					
				}
			}else{

				Sgis.getApplication().fireEvent('dynamicLayer2OnOff', Ext.getCmp("layerTree3").getChecked());

			}


				
				
				
				
				//
				
		}else{
			
			if(node.data.id.substr(0,1) == "p"){
				if(!node.get('leaf')) {
					this.checkAllChildren(node, checked);
				}else{
					Sgis.getApplication().fireEvent('dynamicLayerOnOff', this.getView().getChecked());
				}
				
			}else{
				
				if(!node.get('leaf')) {
					this.checkAllChildren2(node, checked);
				}else{
					Sgis.getApplication().fireEvent('dynamicLayer2OnOff', Ext.getCmp("layerTree3").getChecked());
				}
			}
		}
		
		
	},
	
	//레이어
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
				Sgis.getApplication().fireEvent('dynamicLayerOnOff', me.getView().getChecked());
			}
		});
	},
	
	//주제도
	checkAllChildren2: function(node, checked) {
		var me = this;
		var children = node.childNodes;
		
		//주제도 범례가 있는 경우 열고 닫기
		var i = 0;
		for(i = 0 ; i < children.length ;i++){
			if(children[i].childNodes.length > 0){
				if(checked == true){
					children[i].expand();
				}else{
					children[i].collapse();
				}
				
			}
		}
		
		Ext.each(children, function(child, index) {
			
			//child.expand();
			
			child.set('checked', checked);
			if(index==children.length-1){
				Sgis.getApplication().fireEvent('dynamicLayer2OnOff', Ext.getCmp("layerTree3").getChecked());
			}
		});
	},
	
	onAfterrender:function(){
				var me = this;
				var view = Ext.getCmp("layerTree1");
				//var store = view.getStore();
				var store = Ext.create('Sgis.store.LayerTreeStore');
				//var store = Ext.create("");
				
				var timerId = window.setInterval(function(){
					var test = store.findRecord('id', '1'); //로딩되었는지 검사하려고
					if(test){
						window.clearInterval(timerId); 
						//test.set('checked', true);
							
							var layerAuth = Sgis.app.memType;
							
							//관정 5가 아닌 42 레이어 표출을 후순위로 두었음
							
							//if(layerAuth==6 || layerAuth==7){
							if(layerAuth=="0000" || layerAuth=="0501"){
								layerArr = [1,2,3,4,5,42,6,7,9,10,11,13,14,15,16,18,19,20,23,24,25,27,30,31,32,33,34,35,36,37,38,39,40,43,44,45,46,47]
							// }else if(layerAuth=="20"){
							// 	layerArr = [18,19,20,23,24,25,27,30,31,32,33,34,35,36,37,38,39]
							//}else if(layerAuth==31){
							}else if(layerAuth=="0404"){
								layerArr = [1,2,3,4,5,42,6,8,9,10,11,13,14,15]
							//}else if(layerAuth==2 || layerAuth==5 || layerAuth==40){
							}else if(layerAuth=="0104" || layerAuth=="0103" || layerAuth=="0303"){
								layerArr = [1,2,3,4,5,42,6,8,9,11,13,14,15]
							//}else if(layerAuth==13){
							}else if(layerAuth=="0504"){
								layerArr = [1,2,3,4,5,42,11,13,14,15]
							//}else if(layerAuth==3 || layerAuth==8 || layerAuth==32){
							}else if(layerAuth=="0102" || layerAuth=="0202"){
								layerArr = [1,2,3,4,5,42,6,8,9,11,13,14,15,20]
							}else{
								if(location.href.substr(7,7) == "/sgisin"){
									layerArr = [];
								}else{
									layerArr = [1,2,3,4,11,13,15]
								}
							}
							for(var i=0; i<layerArr.length; i++){
								var record = store.findRecord('id', layerArr[i]);
								if(record){
									record.set('extSel', true);
								}
							}
							
							
							for(var i=1; i<49; i++){
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
							
							if(store.findRecord('id', "p5").childNodes.length==0){
								store.findRecord('id', "p5").drop();
							}
							
							Ext.getCmp("layerTree2").setVisible(true);
							Ext.getCmp("layerTree3").setVisible(true);
							view.setStore(store);
					}
				}, 500);
			}
});
