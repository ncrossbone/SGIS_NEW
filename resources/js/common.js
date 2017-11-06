//공통 common.js 17-09-12 pdj
JibunMove = function(PUN,layerNum){
	Sgis.getApplication().fireEvent('jibunSelect', {PNU:PUN, layerId:layerNum});	
}