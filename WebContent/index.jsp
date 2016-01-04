<%@page contentType="text/html; charset=UTF-8"%>
<%
	response.addHeader("Access-Control-Allow-Origin", "*");
	response.addHeader("Access-Control-Allow-Origin", "http://www.alternatiff.com");
%>

<html>

<head>
  <meta charset="utf-8">
  <title>VisViewerW_Demo(ver1.0)</title>
  <link href="resources/css/kfonts2.css" rel="stylesheet">
  <link href="resources/css/bootstrap.min.css" rel="stylesheet">
  <link href="resources/css/bootstrap-select.css" rel="stylesheet">
  <link href="resources/css/bootstrap_icon.css" rel="stylesheet">
  <link href="resources/css/style.css" rel="stylesheet">
  <link href="resources/css/spectrum.css" rel="stylesheet">
  <link href="resources/css/jquery-ui.min.css" media="screen" rel="stylesheet" type="text/css" />
  <link href="resources/css/stickyNote.css" media="screen" rel="stylesheet" type="text/css" />
  <script src="resources/js/libs/modernizr-2.0.6.min.js"></script>
  
  <style>
/*  Dialog 중앙정렬 시작   */  	
.modal {
  text-align: center;
}

@media screen and (min-width: 768px) { 
  .modal:before {
    display: inline-block;
    vertical-align: middle;
    content: " ";
    height: 100%;
  }
}

.modal-dialog {
  display: inline-block;
  text-align: left;
  vertical-align: middle;
}
/*  Dialog 중앙정렬 끝  */  

.modal-title {
	border-style: bold;
	
}

.modal-body .span_space {
	width:60px;
	display: inline-block;
}
.modal_input_space2 {
	margin-top:10px;
	
}
.modal_input_space3 {
	margin-top:10px;
}
  </style>
  
</head>

<body>

<nav class="navbar navbar-inverse navbar-fixed-top" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">VisViewerW</a>
    </div>
    <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
      <ul class="nav navbar-nav">
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">이미지 <b class="caret"></b></a>
          <ul class="dropdown-menu fileUpload">
            <li>
			    <a href="#" id="loadImage">열기</a>
			    <input type="file" id="file"/>
			</li>
			
 			<li><a id="btn_url_LoadImage" href="#">Url 열기</a></li>
 			<li><a id="btn_base64_LoadImage" href="#">Base64 스트링 열기</a></li>
            <li><a href="#">클립보드 불러오기</a></li>
            
            <li class="divider"></li>
            
            <li><a href="#">로컬 이미지 파일 추가</a></li>
            <li><a href="#">로컬 이미지 파일 삽입</a></li>
            
            <li class="divider"></li>
            
            <li><a href="#">저장</a></li>
            <li class="divider"></li>
            <li><a href="#">즉시 인쇄</a></li>
            <li><a href="#">인쇄 설정</a></li>
            
            <li class="divider"></li>
            <li class="dropdown-submenu">
            <a tabindex="-1" href="#">이미지회전</a>
                <ul class="dropdown-menu">
                  <li><a tabindex="-1" href="#">90도 회전</a></li>
                  <li><a href="#" class="Rotate90L">180도 회전</a></li>
                  <li><a href="#">270도 회전</a></li>
                  <li class="divider"></li>
                  <li><a href="#">직접입력</a></li>
                </ul>
            </li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">보기 <b class="caret"></b></a>
          <ul class="dropdown-menu">
            <li class="dropdown-submenu">
            <a tabindex="-1" href="#">TrackMode</a>
                <ul class="dropdown-menu">
                    
                  <li><a tabindex="-1" href="#" class="dropdown-toggle" >이미지 이동</a></li>
                    
                  <li><a href="#">사각형 그리기</a></li>
                  <li><a href="#">어노테이션</a></li>
                </ul>
            </li>
            <li class="dropdown-submenu">
            <a tabindex="-1" href="#">ZoomMode</a>
                <ul class="dropdown-menu">
                  <li><a tabindex="-1" href="#">가로 맞춤 보기</a></li>
                  <li><a href="#">세로 맞춤 보기</a></li>
                  <li><a href="#">페이지 맞춤 보기</a></li>
                  <li><a href="#">뷰어 맞춤 보기</a></li>
                  <li><a href="#">비율 맞춤 보기</a></li>
                  <li class="divider"></li>
                  <li><a href="#">직접입력</a></li>
                </ul>
            </li>
            <li class="dropdown-submenu">
            <a tabindex="-1" href="#">MouseWheelMode</a>
                <ul class="dropdown-menu">
                  <li><a tabindex="-1" href="#">Not Use</a></li>
                  <li><a href="#">Move</a></li>
                  <li><a href="#">Zoom</a></li>
                </ul>
            </li>
            <li class="divider"></li>
            <li><a href="#">뷰 초기화</a></li>
            <li class="divider"></li>
            <li><a href="#">메인 툴바 보이기/숨기기</a></li>
            <li><a href="#">주석 툴바 보이기/숨기기</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">주석 <b class="caret"></b></a>
          <ul class="dropdown-menu">
            <li><a href="#">사각형 주석 추가</a></li>
            <li><a href="#">텍스트 주석 추가</a></li>
            <li><a href="#">주석 모두 삭제</a></li>
            <li class="divider"></li>
            <li><a href="#">선택한 주석의 좌표 얻기</a></li>
            <li><a href="#">주석을 이미지에 합성하기</a></li>
            <li class="divider"></li>
            <li><a href="#">주석 정보 저장하기</a></li>
            <li><a href="#">주석 정보 불러오기</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">하이라이트 <b class="caret"></b></a>
          <ul class="dropdown-menu">
            <li><a id="btn_hilite_add" href="#">하이라이트 추가</a></li>
            <li><a id="btn_hilite_remove" href="#">하이라이트 삭제</a></li>
          </ul>
        </li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle" data-toggle="dropdown">프린트마크 <b class="caret"></b></a>
          <ul class="dropdown-menu">
            <li><a href="#">이미지 프린트마크</a></li>
            <li><a href="#">텍스트 프린트마크</a></li>
            <li><a href="#">프린트마크 지우기</a></li>
          </ul>
        </li>
                
      </ul>
    </div>
  </div><!-- /.container-fluid -->
</nav>

<nav class="navbar navbar-default navbar-fixed-lower" role="navigation">
  <div class="container">
    <div class="collapse navbar-collapse collapse-buttons">
      <form class="navbar-form navbar-left" role="search">
      	<div class="bs-example" data-example-id="simple-button-toolbar">
			<div class="btn-toolbar" role="toolbar" aria-label="Toolbar with button groups">
		    	<div class="btn-group" role="group" aria-label="Third group">
					<button type="button" class="btn btn-default" title ="출력" id="print"><span class="glyphicon glyphicon-print"></span></button>
				</div>
				<div class="btn-group" role="group" aria-label="First group">
		        	<button type="button" class="btn btn-default" title ="확대" id="CloseUp"><span class="glyphicon glyphicon-zoom-in"></span></button>
		        	<button type="button" class="btn btn-default" title ="축소" id="CloseDown"><span class="glyphicon glyphicon-zoom-out"></span></button>
		        	<button type="button" class="btn btn-default" title ="실재크기" id="orgSize"><span class="glyphicon glyphicon-search"></span></button>
				</div>
		      
		      <div class="btn-group" role="group" aria-label="Second group">
		        <button type="button" class="btn btn-default" title ="화면맞춤" id="fitScreen"><span class="glyphicon glyphicon-fullscreen"></span></button>
		        <button type="button" class="btn btn-default" title ="세로맞춤" id="fitHeight"><span class="glyphicon glyphicon-resize-vertical"></span></button>
		        <button type="button" class="btn btn-default" title ="가로맞춤" id="fitWidth"><span class="glyphicon glyphicon-resize-horizontal"></span></button>
		      </div>
		      <div class="btn-group" role="group" aria-label="Second group">
		        <button type="button" class="btn btn-default" title ="좌회전" id="Rotate90L"><div class="icon_rotate90left"></div></button>
		        <button type="button" class="btn btn-default" title ="우회전" id="Rotate90R"><div class="icon_rotate90right"></div></button>
		        <button type="button" class="btn btn-default" title ="180도회전" id="Rotate180"><div class="icon_rotate180"></div></button>
		      </div>
		      <div class="btn-group" role="group" aria-label="Second group">
		        <button type="button" class="btn btn-default" title ="이미지 이동" id="btn_image_drag"><span class="glyphicon glyphicon-hand-up"></span></button>
		        <button type="button" class="btn btn-default" title ="좌표지정"><span class="glyphicon glyphicon-screenshot"></span></button>
		        <button type="button" class="btn btn-default" title ="어노테이션"><span class="glyphicon glyphicon-edit"></span></button>
		        <button type="button" class="btn btn-default" title ="어노테이션 툴바보기"><span class="glyphicon glyphicon-minus"></span></button>
		      </div>
	   		</div>
  		</div>
      </form>
    </div>
  </div>
</nav>	


<div class="container bg" id="mainContainer" >
	
	<canvas id="annoCanvas" width="608px" height="861px" > </canvas>
	<canvas id="MainImageCanvas"> </canvas>
	
</div> 

<div class="thumbnail_bg">
	<canvas id="thumbnailCanvas"> </canvas>
</div>


<div class="toolSpan1">
	<div class="btn-group-vertical">
		<button class="btn js-tools-cursor"><i class='icon-hand-up'></i></button>
		<button class="btn js-tools-ellipse"><i class='icon-vector_path_circle'></i></button>
		<button class="btn js-tools-rectangle"><i class='icon-vector_path_square'></i></button>
		<button class="btn js-tools-triangle"><i class='icon-vector_path_triangle'></i></button>
		<button class="btn js-tools-line"><i class='icon-vector_path_line'></i></button>
		<button class="btn js-tools-draw"><i class='icon-pencil'></i></button>
		<button class="btn js-tools-text"><i class='icon-text-resize'></i></button>
	</div>
</div>

<div class='properties well'>
    <dl>
      <dt class="js-selected-properties-stroke-width">Stroke Width</dt>
      <dd class="js-selected-properties-stroke-width">
        <select class="js-selected-properties-stroke-width-value span1">
          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
        </select>
      </dd>
      <dt class="js-selected-properties-fill">Fill</dt>
      <dd class="js-selected-properties-fill">
        <input type='text' class='js-selected-properties-fill-value span1 js-color'></input>
      </dd>

      <dt class="js-selected-properties-stroke">Stroke</dt>
      <dd class="js-selected-properties-stroke">
        <input type='text' class='js-selected-properties-stroke-value span1 js-color'></input>
      </dd>

      <dt class="js-selected-properties-font-family">Font Family</dt>
      <dd class="js-selected-properties-font-family">
        <select type="text" class="js-selected-properties-font-family-value span2">
          <option value='sans-serif'>Sans Serif</option>
          <option value='serif'>Serif</option>
          <option value='cursive'>Cursive</option>
          <option value='fantasy'>Fantasy</option>
          <option value='monospace'>Monospace</option>
        </select>
      </dd>

      <dt class="js-selected-properties-font-size">Font Size</dt>
      <dd class="js-selected-properties-font-size">
        <select type="text" class="js-selected-properties-font-size-value span1">
          <option value='24'>24</option>
          <option value='36'>36</option>
          <option value='48'>48</option>
          <option value='64'>64</option>
          <option value='72'>72</option>
        </select>
      </dd>

      <dt class="js-selected-properties-line-height">Line height</dt>
      <dd class="js-selected-properties-line-height">
        <select type="text" class="js-selected-properties-line-height-value span1">
          <option value='0.8'>0.8</option>
          <option value='0.9'>0.9</option>
          <option value='1'>1</option>
          <option value='1.1'>1.1</option>
          <option value='1.2'>1.2</option>
          <option value='1.3'>1.3</option>
        </select>
      </dd>

      <dt class="js-selected-properties-font-style">Italic</dt>
      <dd class="js-selected-properties-font-style">
        <label class="js-bootstrap-toggle"><input class="btn js-selected-properties-font-style-value" type="checkbox" value="italic"/><i class='icon-italic'></i></label>
      </dd>

      <dt class="js-selected-properties-font-weight">Bold</dt>
      <dd class="js-selected-properties-font-weight">
        <label class="js-bootstrap-toggle"><input class="btn js-selected-properties-font-weight-value" type="checkbox" value="bold"/><i class='icon-bold'></i></label>
      </dd>
    </ul>
  </div>



<!-- 
 Dialog
-->

<!-- Input Modal : URL열기 시작-->
<div class="modal fade" id="modal_url_LoadImage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
         <h4 class="modal-title" id="gridSystemModalLabel" style="font-weight:bold;">URL 이미지 열기</h4>
      </div>
      <div class="modal-body">
      	<div class="modal_input_space1">
        	 <label for="recipient-name" class="control-label">URL:</label><input type="text" class="form-control" id="input_url_image" value="http://www.alternatiff.com/sample.tif"/>
        </div>
      </div>
      <div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
		<button type="button" class="btn btn-primary" id ="btn_submit_url_LoadImage">확인</button>
      </div>
    </div>
  </div>
</div>
<!-- Input Modal : URL열기 끝-->

<!-- Input Modal : Base64 String 열기 시작-->

<div class="modal fade" id="modal_base64_LoadImage" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
         <h4 class="modal-title" id="gridSystemModalLabel" style="font-weight:bold;">Base64 String 열기</h4>
      </div>
      <div class="modal-body">
      	<div class="modal_input_space1">
        	 <label for="recipient-name" class="control-label">Base64 String:</label>
        	 <textarea type="text" id="textarea_base64_image" style=" width:100%;height:350px;"></textarea>
        </div>
      </div>
      <div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
		<button type="button" class="btn btn-primary" id ="btn_submit_base64_LoadImage">확인</button>
      </div>
    </div>
  </div>
</div>

<!-- Input Modal : Base64 String 열기  끝-->


<!-- Input Modal : 하이라이트 추가 시작 -->
<div class="modal fade" id="modal_input" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
         <h4 class="modal-title" id="gridSystemModalLabel" style="font-weight:bold;">하이라이트 추가</h4>
      </div>
      <div class="modal-body">
      	<div class="modal_input_space1">
        	 <label for="recipient-name" class="control-label">Width:</label><input type="text" class="form-control" id="input_hilite_width" value="200"/>
        </div>
        <div class="modal_input_space2">
        	<label for="recipient-name" class="control-label">Height:</label><input type="text" class="form-control" id="input_hilite_height" value="40"/>
        </div>
        <div class="modal_input_space3">
        	<label for="recipient-name" class="control-label">Color:</label>
        	<select class="form-control selectpicker">
			    <option>Red</option>
			    <option>Yellow</option>
			    <option>Green</option>
			 </select>
        </div>
      </div>
      <div class="modal-footer">
		<button type="button" class="btn btn-default" data-dismiss="modal">취소</button>
		<button type="button" class="btn btn-primary" id ="btn_dialog_submit">적용</button>
      </div>
    </div>
  </div>
</div>
<!-- Input Modal : 하이라이트 추가  끝-->





  <!-- JavaScript at the bottom for fast page loading -->
  <script src="resources/js/libs/jquery-1.11.3.min.js"></script>	
  <script type="text/javascript">
	jQuery.browser = {};
	(function () {
	    jQuery.browser.msie = false;
	    jQuery.browser.version = 0;
	    if (navigator.userAgent.match(/MSIE ([0-9]+)\./)) {
	        jQuery.browser.msie = true;
	        jQuery.browser.version = RegExp.$1;
	    }
	})();
	</script>
		
  <script src="resources/js/libs/plugins.js"></script>
  <script src="resources/js/libs/printThis.js"></script>
  <script src="resources/js/libs/bootstrap.min.js"></script>  
  <script src="resources/js/libs/bootstrap-select.js"></script> 
  <script src="resources/js/libs/spectrum.js"></script>  
  <script src="resources/js/mylibs/img.control.js"></script>
  <script src="resources/js/mylibs/img.edit.js"></script>
  <script src="resources/js/mylibs/INFOLIBTIFF.js"></script>
  <script src="resources/js/mylibs/megapix-image_visutilver.js"></script>
  <script src="resources/js/mylibs/base64toCanvas.js"></script>
  <script src="resources/js/mylibs/Uint8ToBase64.js"></script>
  <script src="resources/js/libs/drawing_fabric.js"></script>
  <script src="resources/js/libs/fabric.js"></script>
  <script src="resources/js/mylibs/tools.js"></script>
  <script src="resources/js/main.js"></script>
  <script src="resources/js/libs/jquery-ui.min.js" type="text/javascript"></script>
  <script src="resources/js/libs/jquery-stickynotes.js" type="text/javascript"></script>
  <script src="resources/js/libs/drag-on.js"></script>

  <!-- end scripts-->


	
  <!-- Change UA-XXXXX-X to be your site's ID -->
  <script>
    window._gaq = [['_setAccount','UAXXXXXXXX1'],['_trackPageview'],['_trackPageLoadTime']];
    Modernizr.load({
      load: ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js'
    });

  
  </script>

  <!-- Prompt IE 6 users to install Chrome Frame. Remove this if you want to support IE 6.
       chromium.org/developers/how-tos/chrome-frame-getting-started -->
  <!--[if lt IE 7 ]>
    <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
    <script>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
  <![endif]-->
</body>
</html>

