Ext.define('Sgis.view.south.LayerDynamicGrid', {

	extend : 'Ext.grid.Panel',
	
	requires : [
		'Ext.grid.column.Action',
		'Sgis.store.LayerDynamicStore',
		'Sgis.view.south.LayerDynamicGridController',
		'Sgis.view.south.popup.BranchInfoPopup',
		'Ext.grid.filters.Filters'
	],
	
	xtype : 'layer_dynamic_grid',
	
	layerId : '0',
	
	controller : 'layer_dynamic_grid',

	title : '',
	
	store : Ext.create('Ext.data.Store'),

	flex : 1,
		
	autoScroll : true,
		
	rowLines : true,
		
	columnLines : true,
	
	plugins: ['gridfilters'],
	
	columns : [ { 
		dataIndex : 'id',
		width : 30,
		text : ''
	} ],
	
	tbar : {
		xtype : 'toolbar',
		items : []
	},
	
	bbar : {
		xtype : 'pagingtoolbar',
		cls : 'pagingToolbar',
		store : this.store,
		displayInfo: true,
		displayMsg: '{0} - {1} of {2}',
		emptyMsg: '데이터가 없습니다.'
	},
	
	getPageSize : function() {
		var toolbar = this.down('toolbar');
		var pageCountComp = toolbar.down('#btnCountPerPage');
		return parseInt(pageCountComp ? pageCountComp.getText() : '15');
	},
	
	bindPagingToolbar : function(store) {
		var pagingtoolbar = this.down('pagingtoolbar');
		pagingtoolbar.bindStore(store);
		
		//최소 페이징처리시 total count 가 1로 나오는 현상 강제 처리
		var afterTextItem = pagingtoolbar.getComponent('afterTextItem');
		afterTextItem.text = "of "+pagingtoolbar.getPageData().pageCount;
	},
	
	refreshGrid : function(result) {
		this.reconfigureSearchForm(result);
		this.reconfigureGrid(result);
	},
	
	/**
	 * Reconfigure search form
	 */
	reconfigureSearchForm : function(result) {

		// remove previous items
		var toolbar = this.down('toolbar');
		var isFirst = toolbar.items.length > 0 ? false : true;
		var filters = result.filter;
		
		if(!filters || filters.length == 0) {
			if(isFirst) {
				this.addDefaultToolbarItem(toolbar);
			}
			return;
		}
		
		// 1. 처음 툴바를 구성하는 것이라면 모든 필터 컴포넌트를 추가 
		if(isFirst) {
			// add new items
			for(var i = 0 ; i < filters.length ; i++) {
				var filter = filters[i];
				var filterName = '';
			
				for(var prop in filter) {
					filterName = prop;
				}
				
				// 필터값을 데이터로 부터 추출한다.
				var filterValues = this.extractFilterValues(filterName, result.datas);
				var filterLabel = this.newFilterLabel(filterName);
				var filterItems = [];
				for(var j = 0 ; j < filterValues.length ; j++) {
					filterItems.push({
						text : filterValues[j]
					});
				}
			
				var filterComp = this.newFilterComp(filterName, filterItems);
				//toolbar.add(filterLabel);
				//toolbar.add(filterComp);
			}
			
			this.addDefaultToolbarItem(toolbar);
			
		// 2. 처음 툴바를 구성하는 것이 아니라면 필터 값만 변경
		} else {
			for(var i = 0 ; i < filters.length ; i++) {
				var filter = filters[i];
				var filterName = '';
				var filterValues = [];
			
				for(var prop in filter) {
					filterName = prop;
					filterValues = filter[filterName];
				}
			
				item = toolbar.child('#' + filterName);
				item.items = [];
				for(var j = 0 ; j < filterValues.length ; j++) {
					item.items.push({
						text : filterValues[j]
					});
				}
			}
		}
	},
	
	addDefaultToolbarItem : function(toolbar) {
		// add separator
		toolbar.add('->');	
		
		// excel export 버튼 
		toolbar.add({
			itemId : 'export',
			xtype : 'button',
			text : '액셀받기',
			handler : 'exportExcel',
			hidden: false
		});
		
		// add count per page label
		toolbar.add({
			itemId : 'lblCountPerPage',
			xtype : 'label',
			text : '페이지 당 데이터 개수',
			padding : '0 10 0 10'
		});
		
		// add count per page comp
		toolbar.add({
			itemId : 'btnCountPerPage',
			xtype : 'cycle',
			showText : true,
			menu : {
				items : [{
					text : '15',
					checked : true
				}, {
					text : '30'
				}, {
					text : '50'
				}]
			}
		});
	},
	
	newFilterLabel : function(filterName) {
		return {
			xtype : 'label',
			text : filterName,
			padding : '0 10 0 10'
		};
	},
	
	newFilterComp : function(filterName, filterItems) {
		return {
			itemId : filterName,
			xtype : 'cycle',
			showText : true,
			menu : {
				items : filterItems
			}
		};
	},

	/**
	 * Reconfigure grid
	 */	
	reconfigureGrid : function(result) {
		var store = this.getStore();
		
		if(store == null || !store.fields) {
			var data = this.getLayerDataAll(result);
			if(data && data[0] && data[1]) {
				this.reconfigureDynamicGrid(data[0], data[1]);
			}
		} else {
			var data = this.getLayerData(result);
			if(data) {
				store.getProxy().setData(data);
				store.read();
			}
		}
	},
	
	reconfigureDynamicGrid : function(headers, dataList) {
		var columns = [];
		var headerConut = headers.length;
		
		for(var i = 0 ; i < headerConut ; i++) {
			
			// 첫 컬럼에 row numberer 추가 
			if(i == 0) {
				columns.push({
					xtype : 'rownumberer',
					text : '#',
					dataIndex : 'no',
					width : 50
				})
			}
			
			columns.push({
				text : headers[i].text,
				dataIndex : headers[i].dataIndex,
				hidden : headers[i].hidden,
				filter: 'string', //string
				flex : 1
			})
			
			// 마지막 컬럼에 버튼 두 개 추가
			if(i == headerConut - 1) {


				columns.push({
					text: '지점상세',
					align: 'center',
					dataIndex: '',
					hidden: false,
					flex : 1,
					renderer: function(val){
						return "<a href='#'>지점상세</a>";
					},
					listeners: {
						click: function(a, rowIdx, colIdx, d, e, record,f){
							
							//레이어 아이디
							var layerId = this.getView().ownerGrid.layerId;
							
							//지점상세 url get
							var storeRecord = Ext.getCmp("layerTree2").store.findRecord('id', layerId);
							
							//url이 없을시 return;
							if(storeRecord.data.linkNum == undefined){
								return;
							}
							
							SGIS.popup('Sgis.map.InfoWindow');
							Ext.getCmp('InfoWindowField1').setValue(record.data.PT_NM);
							Ext.getCmp('InfoWindowField2').setValue(record.data.ADDR);
							Ext.getCmp('InfoWindowField3').setValue(record.data.CODE);
							Ext.getCmp('InfoWindowField4').setValue(storeRecord.data.linkNum);
							Ext.getCmp('InfoWindowIns').setTitle(this.getView().ownerGrid.title);
						}
					}
				})
				
			}
		}
		
		var store = this.createDynamicStore(columns, dataList);
		if(columns) {
			this.reconfigure(store, columns);
		} else {
			store.read();
		}
		Ext.resumeLayouts(true);
	},
	
	gridFields:null,
	gridData:null,
	createDynamicStore : function(headers, dataList) {
		var store = this.getStore();
		var pageSize = this.getPageSize();
		this.gridData = dataList;
		
		if(headers && (store == null || !store.fields)) {
			this.gridFields = [];
			this.gridFieldsKo = [];

			for(var i = 0 ; i < headers.length ; i++) {
				this.gridFields.push(headers[i].dataIndex);
				this.gridFieldsKo.push(headers[i].text);
			}
		
			store = Ext.create('Sgis.store.LayerDynamicStore', {
				fields: this.gridFields,
				data: dataList
			});
		}
		
		if(!headers){
			var fields = store.fields;
			store = Ext.create('Sgis.store.LayerDynamicStore', {
				fields: this.gridFields,
				data: dataList
			});
		}

		store.setPageSize(pageSize);
		store.getProxy().setData(dataList);
		this.setStore(store);
		this.bindPagingToolbar(store);
		return store;
	},
	
	/**
	 * Get Layer Data - Headers & Data
	 */	
	getLayerDataAll : function(result) {
		if(result) {
			var headers = this.getLayerMetadata(result);
			var dataList = this.getLayerData(result);
			return [headers, dataList];
		} else {
			return null;
		}
	},
	
	/**
	 * Get Layer Columns Information
	 */
	getLayerMetadata : function(result) {
		var fields = result.field;
		if(!fields) {
			return null;
		}
		
		var headers = [];
		
		for(var i = 0 ; i < fields.length ; i++) {
			var hidden = fields[i].hasOwnProperty('flag');
			var header = {
				text: fields[i].fnm,
				dataIndex: fields[i].fid,
				hidden: hidden
			};
			
			headers.push(header);
		}
		
		return headers;
	},
	
	/**
	 * Get Layer Data
	 */
	getLayerData : function(result) {
		var headers = result.field;
		if(!headers) {
			return null;
		}
		
		var datum = result.datas;
		if(!datum) {
			return null;
		}
		
		var dataList = [];
		
		for(var i = 0 ; i < datum.length ; i++) {
			var data = {};
			
			for(var j = 0 ; j < headers.length ; j++) {
				data[headers[j].fid] = datum[i][headers[j].fid];
			}
			
			dataList.push(data);
		}
		
		return dataList;
	},
	
	extractFilterValues : function(filterField, dataList) {
		var filterValues = [];
		for(var i = 0 ; i < dataList.length ; i++) {
			var data = dataList[i];
			var filterData = data[filterField];
			if(filterData && !Ext.Array.contains(filterValues, filterData)) {
				filterValues.push(filterData);
			}
		}
		
		Ext.Array.sort(filterValues);
		filterValues.unshift("ALL");
		return filterValues;
	}
});
