Ext.define('Sgis.view.north.measure.MeasureWindow', {
    extend: 'Ext.window.Window',
    xtype: 'app-measureWindow',

    requires: [
        'Ext.tab.Panel',
        'Ext.tab.Tab',
        'Ext.form.FieldSet',
        'Ext.form.field.ComboBox',
        'Sgis.view.north.MeasureWindowController'
    ],

    controller: 'app-measurewindow',
    
    height: 200,
    width: 320,
    bodyPadding: 0,
    title: '측정',
    id: 'measurewindowPop',
    items: [
        {
            xtype: 'tabpanel',
            activeTab: 0,
            bodyPadding: 6,
            items: [
                {
                    xtype: 'panel',
                    bodyBorder: false,
                    title: '면적',
                    items: [
                        {
                            xtype: 'fieldset',
                            title: '면적단위',
                            layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'center',
                                padding: '4 4 4 4'
                            },
                            items: [
                                {
                                    xtype: 'combobox',
                                    flex: 1,
                                    id: 'areaUnit',
                                	store: new Ext.data.SimpleStore({
                                		data: [
											['UNIT_ACRES' , '에이커'],
											['UNIT_SQUARE_MILES' , '평방마일'],
											['UNIT_SQUARE_KILOMETERS' , '평방킬로미터'],
											['UNIT_SQUARE_METERS' , '평방미터'],
											['UNIT_HECTARES' , '평방헥타르'],
											['UNIT_SQUARE_YARDS' , '평방야드'],
											['UNIT_SQUARE_FEET' , '평방피트']
                                		],
                                		id: 0,
                                		fields: ['value', 'text']
                                	})
                                },
                                {
                                	xtype: 'tbspacer', width: 10
                                },
                                {
                                    xtype: 'button',
                                    flex: 0.3,
                                    text: '측정',
                                    itemId: 'areaBtn'
                                }
                            ]
                        },
                        {
                        	xtype: 'fieldset',
                        	title: '결과',
                        	height: 45,
                        	layout: {
                                type: 'hbox',
                                align: 'stretch',
                                pack: 'center',
                                padding: '0 4 4 4'
                            },
                            items: [
                                    {
                                        xtype: 'label',
                                        flex: 1,
                                        id:'areaResult',
                                        text: ''
                                    }
                                ]
                        }
                    ]
                },
                {
                    xtype: 'panel',
                    title: '거리',
                    items: [
                            {
                                xtype: 'fieldset',
                                title: '거리단위',
                                layout: {
                                    type: 'hbox',
                                    align: 'stretch',
                                    pack: 'center',
                                    padding: '4 4 4 4'
                                },
                                items: [
                                    {
                                        xtype: 'combobox',
                                        flex: 1,
                                        id: 'lengthUnit',
                                    	store: new Ext.data.SimpleStore({
                                    		data: [
												['UNIT_KILOMETER' , '킬로키터'],
												['UNIT_METER' , '미터']
                                    		],
                                    		id: 0,
                                    		fields: ['value', 'text']
                                    	})
                                    },
                                    {
                                    	xtype: 'tbspacer', width: 10
                                    },
                                    {
                                        xtype: 'button',
                                        flex: 0.3,
                                        text: '측정',
                                        itemId: 'lengthBtn'
                                    }
                                ]
                            },
                            {
                            	xtype: 'fieldset',
                            	title: '결과',
                            	height: 45,
                            	layout: {
                                    type: 'hbox',
                                    align: 'stretch',
                                    pack: 'center',
                                    padding: '0 4 4 4'
                                },
                                items: [
                                        {
                                            xtype: 'label',
                                            flex: 1,
                                            id:'lengthResult',
                                            text: ''
                                        }
                                    ]
                            }
                        ]
                },
                {
                    xtype: 'panel',
                    title: '위치',
                    items: [
                            {
                                xtype: 'fieldset',
                                title: '도/DMS',
                                layout: {
                                    type: 'hbox',
                                    align: 'stretch',
                                    pack: 'center',
                                    padding: '4 4 4 4'
                                },
                                items: [
                                    {
                                        xtype: 'combobox',
                                        flex: 1,
                                        id: 'pointUnit',
                                    	store: new Ext.data.SimpleStore({
                                    		data: [
												['degree' , '도'],
												['dms' , 'DMS']
                                    		],
                                    		id: 0,
                                    		fields: ['value', 'text']
                                    	})
                                    },
                                    {
                                    	xtype: 'tbspacer', width: 10
                                    },
                                    {
                                        xtype: 'button',
                                        flex: 0.3,
                                        text: '측정',
                                        itemId: 'pointBtn'
                                    }
                                ]
                            },
                            {
                            	xtype: 'fieldset',
                            	title: '결과',
                            	height: 45,
                            	layout: {
                                    type: 'hbox',
                                    align: 'stretch',
                                    pack: 'center',
                                    padding: '0 4 4 4'
                                },
                                items: [
                                        {
                                            xtype: 'label',
                                            flex: 1,
                                            id:'pointResult1',
                                            text: ''
                                        },
                                        {
                                            xtype: 'label',
                                            flex: 1,
                                            id:'pointResult2',
                                            text: ''
                                        }
                                    ]
                            }
                        ]
                }
            ]
        }
    ]

});