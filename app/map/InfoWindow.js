Ext.define('Sgis.map.InfoWindow', {
    extend: 'Ext.window.Window',
    xtype: 'app-infoWindow',

    requires: [
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.form.FieldSet',
        'Ext.form.field.ComboBox',
        'Sgis.view.north.MeasureWindowController'
    ],

    controller: 'app-measurewindow',
    
    id:'InfoWindowIns',
    height: 140,
    width: 370,
    bodyPadding: 0,
    title: '측정',
    padding:'4, 4, 4, 4',
	layout: {
        type: 'table',
        columns: 1,
        tableAttrs: {
            style: {
                width: '100%',
                border: '0px solid #CCCCCC'
            }
        }
    },
    items: [{
    	id:'InfoWindowField1',
    	xtype: 'displayfield',
        fieldLabel: '명칭',
        style: 'margin-bottom: -1px; border: 1px solid #CCCCCC', 
        labelStyle:'padding-left:4px; background-color: #eeeeee',
        labelWidth:80,
        width:350, height:30,
        fieldStyle:'padding-left:4px'
        
    },{
    	id:'InfoWindowField2',
    	xtype: 'displayfield',
        fieldLabel: '주소',
        style: 'margin-bottom: -1px; border: 1px solid #CCCCCC', 
        labelStyle:'padding-left:4px; background-color: #eeeeee',
        labelWidth:80,
        width:350, height:30,
        fieldStyle:'padding-left:4px'
    },{
    	id:'InfoWindowField3',
    	xtype: 'displayfield',
        fieldLabel: 'code',
        style: 'margin-bottom: -1px; border: 1px solid #CCCCCC', 
        labelStyle:'padding-left:4px; background-color: #eeeeee',
        labelWidth:80,
        width:350, height:30,
        fieldStyle:'padding-left:4px',
        hidden:true
    },{
    	id:'InfoWindowField4',
    	xtype: 'displayfield',
        fieldLabel: 'link',
        style: 'margin-bottom: -1px; border: 1px solid #CCCCCC', 
        labelStyle:'padding-left:4px; background-color: #eeeeee',
        labelWidth:80,
        width:350, height:30,
        fieldStyle:'padding-left:4px',
        hidden:true
    },{
    	
			xtype: 'toolbar',
			style: 'margin-bottom: -1px; border-bottom: 0px; border-left: 0px; border-right: 0px', 
			dock: 'bottom',
			items: [
				{ xtype: 'tbfill' },
				{
					xtype: 'button',
					text: '이동',
					handler : function(button){
						var A = Ext.getCmp('InfoWindowField4').getValue();
						var CODE = Ext.getCmp('InfoWindowField3').getValue();
						//TEST URL
						//window.open('http://112.217.167.123:17110/'+A+'&p_spot_std_code='+CODE);
						
						//운영 URL
						window.open('http://10.101.95.130/'+A+'&p_spot_std_code='+CODE);
						Ext.getCmp('InfoWindowIns').close();
					}
					
				}
			]
		
    }]
});