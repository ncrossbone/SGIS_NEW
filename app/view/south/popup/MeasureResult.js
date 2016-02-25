Ext.define('Sgis.view.south.popup.MeasureResult', {
    extend: 'Ext.container.Container',
    xtype: 'sourth_branch_measureResult',
    alias: 'widget.sourth_branch_measureResult',
    requires : [
                'Sgis.view.south.popup.MeasureResultViewModel',
                'Sgis.view.south.popup.MeasureResultController'	
	],
    
	viewModel: 'sourth_branch_measureResult',
	controller: 'sourth_branch_measureResult',
	
	listeners: {
    	afterrender: 'afterrenderHandler'
    },

	padding:'4, 4, 4, 4',
	
	params:null,
	
	layout: {
        type: 'vbox',
        align: 'stretch',
        pack: 'center'
    },
    
    chartAddInfo:{},
    
    items: [{
    	id:'measureGrid',
		xtype : 'grid',
		flex:0.4,
		autoScroll : true,
		rowLines : true,
		columnLines : true,
		bind:{store:'{grid}'},
		listeners: {
            afterrender: function(c) {                                        
                var menu = c.headerCt.getMenu();
                var menuItem = menu.add({
                    text: '차트추가',
                    handler: function(col) {
                    	var currentDataIndex = menu.activeHeader.dataIndex;  
                    	var currentDataText = menu.activeHeader.text;
                    	$('#' + menu.activeHeader.id + '-textEl').css({color:'#ff0000'});
                    	Ext.getCmp('measureGrid').up().chartAddInfo['col_'+menu.activeHeader.dataIndex] = {index:currentDataIndex, text:currentDataText};
                    	this.fireEvent('chartAdd', currentDataIndex);
                    }
                });
                
                var menu2 = c.headerCt.getMenu();
                var menuItem2 = menu2.add({
                    text: '차트삭제',
                    handler: function(col) {
                    	var currentDataIndex = menu.activeHeader.dataIndex; 
                    	$('#' + menu.activeHeader.id + '-textEl').css({color:''});
                    	delete Ext.getCmp('measureGrid').up().chartAddInfo['col_'+currentDataIndex];
                    	this.fireEvent('chartRemove', currentDataIndex);
                    }
                });
                
                menu.on('beforeshow', function() {
                   var currentDataIndex = menu.activeHeader.dataIndex; 
                   if(Ext.getCmp('measureGrid').up().chartAddInfo['col_'+currentDataIndex]){
                	   menuItem.hide();
                	   menuItem2.show();
                   }else{
                	   menuItem.show();
                	   menuItem2.hide();
                   }
                   if(currentDataIndex=='OBJECTID'){
                	   menuItem.hide();
                	   menuItem2.hide();
                   }
                });
            }
        }
	},{
		xtype: 'cartesian',
		id:'measureChart',
		flex:0.6,
        animate: true,
        shadow: false,
        insetPadding: 40,
        style: 'background: #ccc;',
        bind:{store:'{grid}'},
	    axes: [{
	        type: 'numeric',
	        position: 'left',
	        grid: true
	    }, {
	        type: 'category',
	        position: 'bottom',
	        grid: true
	    }],
	    legend: {
	    	docked: 'right',
            boxStrokeWidth: 0,
            labelFont: '12px Helvetica'
        }
	}],
	
	makeGrid:function(){
		var me = this;
		me.chartAddInfo = {};
		var columns = [];
		var grid = me.down('#measureGrid');
		var fields = Sgis.app.coreMap.getLayerChartFiledInfo()[me.params.layerId];
		for(var i=0; i<fields.length; i++){
			columns.push({
				width:80,
				text : fields[i].fnm,
				dataIndex : fields[i].fid
			})
		}
		grid.reconfigure([], columns);
	},
	
	makeChartSeries:function(series){
		var me = this;
		var chart = me.down('#measureChart');
		chart.setSeries(series);
	}
});