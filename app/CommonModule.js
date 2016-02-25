Ext.define('Sgis.CommonModule', {
	
	alternateClassName : ['SGIS'],
	
	requires: [
		'Cmm.view.Popup'
	],
	
	singleton : true,

	mixins : {
		msg : 'Cmm.mixin.Msg',
		menu : 'Cmm.mixin.Menu',
		loading : 'Cmm.mixin.Loading'
	}
});
