$(document).ready(function(){
var zoomPointerTop = parseInt($(".zoomPointer").css("top"));
var zoomBar = parseInt($(".zoomBar").height());
var zoomBar2 = parseInt($(".zoomBar2").height());

//줌컨트롤 top 최대값 최소값
var _maxTop = 154;
var _minTop = 34

   
   $(".zoomPointer").draggable({
		 cursor:"pointer",
         containment:".zoomRoute",
         axis:"y",

		 drag: function() {
		 },
		 stop: function() {
			var condition = "dragStop";
			topCalc(1,condition);
		 }
   });
   
   $(".minus").click(function(){
		var topPx = $(".zoomPointer").css("top");
		var pxSplit = parseInt(topPx.split('px')[0]);
		var cnt = 0;
		var calc = pxSplit + 10;
		
		if(pxSplit<_maxTop){
			$(".zoomPointer").css("top",calc);
			cnt++;
			topCalc(cnt);
			zoomEvent(calc);
		}
   });
   
	$(".plus").click(function(){
		var topPx = $(".zoomPointer").css("top");
		var pxSplit = parseInt(topPx.split('px')[0]);
		var cnt = 0;
		var calc = pxSplit - 10;
		
		if(pxSplit>_minTop){
			$(".zoomPointer").css("top",calc);
			topCalc(cnt);
			zoomEvent(calc);
		}
   });
   
   $(".minus").mouseover(function(){
		$('.minus').css( 'cursor', 'pointer' );
   });
   
   $(".plus").mouseover(function(){
		$('.plus').css( 'cursor', 'pointer' );
   });
   
   function topCalc(cnt,con){
		var topPx = $(".zoomPointer").css("top");
		var pxSplit = parseInt(topPx.split('px')[0]);
		var calc = zoomPointerTop - pxSplit;
		
		if(con=="dragStop"){
			var round = Math.round(pxSplit/10)*10 + 4;
			var calcRound = zoomPointerTop - round;
			$(".zoomBar").height(zoomBar - calcRound);
			$(".zoomBar2").height(zoomBar2 + calcRound);
			$(".zoomPointer").css("top",round);
			zoomEvent(round);
		}else{
			if(cnt!=0){
				$(".zoomBar").height(zoomBar - calc);
				$(".zoomBar2").height(zoomBar2 + calc);
			}else{
				$(".zoomBar").height(zoomBar - calc -10);
				$(".zoomBar2").height(zoomBar2 + calc + 10);
			}
		}
   }
   //zoom 이벤트 처리
   function zoomEvent(top){
		console.info(top);
   }
});