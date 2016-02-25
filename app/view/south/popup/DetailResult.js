Ext.define('Sgis.view.south.popup.DetailResult', {
    extend: 'Ext.container.Container',
    xtype: 'sourth_detail_infolResult',
    alias: 'widget.sourth_detail_infoResult',
    requires : [
                'Sgis.view.south.popup.DetailResultViewModel',
                'Sgis.view.south.popup.DetailResultController'	
	],
    
	viewModel: 'sourth_detail_infoResult',
	controller: 'sourth_detail_infoResult',
	
	listeners: {
    	afterrender: 'afterrenderHandler'
    },
    
    params:null,
    autoScroll : true,
	
	padding:'4, 4, 4, 4',
	layout: {
        type: 'table',
        columns: 1,
        tableAttrs: {
            style: {
                width: '100%'
            }
        }
    },
    
    addItem:function(){
    	var me = this;
    	var fields = Sgis.app.coreMap.getLayerDetailFiledInfo()[me.params.layerId];
		for(var i=0; i<fields.length; i++){
			this.add({
                xtype: 'displayfield',
                fieldLabel: fields[i].fnm,
                style: 'margin-bottom: -1px; border: 1px solid #CCCCCC', 
                labelStyle:'padding-left:4px; background-color: #eeeeee',
                labelWidth:240,
                fieldStyle:'padding-left:4px',
                width:824, height:30,
                bind:{value:'{'+fields[i].fid+'}'}
            });
		}
    }
});