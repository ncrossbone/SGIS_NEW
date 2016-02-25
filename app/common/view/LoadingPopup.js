Ext.define('Cmm.view.LoadingPopup', {
	xtype: 'cmm_loadingPopup',
	
	html: '<div class="popLoading" id="viewLoading" style="z-index:99999;">' +
		  '	<p class="dataStop">처리중입니다.</p>' +
		  '	<p id="loadingP"></p>' +
		  '	<p class="stopBtn"><a href="javascript:void(0)" id="executeCancel" class="btn">' +
		  '		<img src="resources/images/ico_stop.png" alt="" /> 실행중지</a>' +
		  '	</p>' + 
		  '</div>',
		  
   height:null,
	
   constructor:function(){
	   var me = this;
	   /*document.getElementById('_gooBody_').addEventListener('click', me.clickCheck, true);
	   $('body').append(me.html);
	   $('#executeCancel').off('click').on('click' ,function(){
		   SGIS.loading.abortFinish();
		   me.customHide();
	   });*/
   },
		  
   timerId:null,
   
   customShow: function(){
		var me = this;
		
		if(!me.height){
			me.height = $(window).height()/2-$('#viewLoading').height()/2 + 40;
			$('#viewLoading').css({'top':me.height});
		}
		
		$('#loadingP').html('<img id="loadingImg" src="resources/images/loader2.gif" alt=""/>');
		if($('#viewLoading').css('display')=="none"){
			$('#viewLoading').css({opacity: 0});
			$('#viewLoading').css({'box-shadow': '0px 0px 0px 0px rgba(0, 0, 0, 0)'});
			$('#viewLoading').show();
			if(me.timerId){
				window.clearInterval(me.timerId);
			}
			if(me.timerId2){
				window.clearInterval(me.timerId2);
			}
			me.timerId = window.setInterval(function(){
				$('#viewLoading').css({opacity: 1});
				window.clearInterval(me.timerId);
			}, 1500);
			me.timerId2 = window.setInterval(function(){
				$('#viewLoading').css({'box-shadow': '0px 0px 3200px 3200px rgba(0, 0, 30, 0.4)'});
				window.clearInterval(me.timerId2);
			}, 2500);
		}
	},
	
	customHide: function(){
		var me = this;
		$('#viewLoading').hide();
		$('#loadingP').html('');
	},
	
	clickCheck:function(event){
		if($('#viewLoading').css('display')!="none" && event.target.id!="executeCancel"){
			if(event.stopPropagation) {
			    event.stopPropagation();
			    event.returnValue = false;
			} else {
			    event.returnValue = false;
			}
		}
	}
});