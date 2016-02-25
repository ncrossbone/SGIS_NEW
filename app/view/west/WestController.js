/**
* West Controller
*/
Ext.define('Sgis.view.west.WestController', {
	
	extend: 'Ext.app.ViewController',
	
	requires: [ 
		'Sgis.view.west.LayerInfoPopupGrid',
		'Sgis.view.west.ScaleInfoPopupGrid'
	],

	alias: 'controller.app-west',
	
	control:{
		'app-west': {
			tabchange: 'tabchangeHandler'
		}
	},

	onClickWestLayer: function() {
		SGIS.popup('Sgis.view.west.LayerInfoPopupGrid');
	},
	
	onClickWestScale: function() {
		SGIS.popup('Sgis.view.west.ScaleInfoPopupGrid');
	},
	
	onClickLegalNotice: function() {
		var info = "<b>[지도축척 1: 236,800(9레벨)] [고지사항] </b></br></br>"; 
		info += "본 지리정보시스템에서 제공하는 각종 지도는 '단순한 열람용으로 참조'</br>";
		info += "하시기 바라며, 재산권 등의 법적효력이 없습니다.";
		SGIS.msg.alert({title : '법적 고지', msg : info});
	},
	
	tabchangeHandler: function(tabPanel, newCard, oldCard, eOpts){
		Sgis.getApplication().fireEvent('leftTabChange', newCard.xtype); //레이어탭 app-west-tab1 //자료검색탭활 app-west-tab2
	}
});
