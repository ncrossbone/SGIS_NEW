/**
* West Tab1 Tree Controller
*/
Ext.define('Sgis.view.west.WestTab1Controller', {
	
	extend: 'Ext.app.ViewController',

	alias: 'controller.app-west-tab1',

	control: {
		'treepanel': {
			checkchange: 'onCheckChanged'
		}
	},
	
	onCheckChanged: function(node, checked, eOpts) {
		
		console.info(node.get('leaf'));
		console.info(node);
		
		if(node.data.parentId.substr(0,1) == "p"){
			if(!node.get('leaf')) {
				this.checkAllChildren(node, checked);
			}else{
				Sgis.getApplication().fireEvent('dynamicLayerOnOff', this.getView().getChecked());
			}
		}else if(node.data.parentId.substr(0,1) == "b"){
			if(!node.get('leaf')) {
				this.checkAllChildren2(node, checked);
			}else{
				Sgis.getApplication().fireEvent('dynamicLayer2OnOff', Ext.getCmp("layerTree3").getChecked());
			}
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
		
		
			
		/*if(!node.get('leaf')) {
			this.checkAllChildren(node, checked);
		}else{
			Sgis.getApplication().fireEvent('dynamicLayerOnOff', this.getView().getChecked());
		}*/
	},
	
	checkAllChildren: function(node, checked) {
		var me = this;
		var children = node.childNodes;
		
		
		//3dep 일시
		Ext.each(children, function(child, index) {
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
	
	checkAllChildren2: function(node, checked) {
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
				Sgis.getApplication().fireEvent('dynamicLayer2OnOff', Ext.getCmp("layerTree3").getChecked());
			}
		});
	}
});
