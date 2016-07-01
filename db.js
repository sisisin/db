var ary_storage = {};
var RGList = new Object();	//"No":[name,ver,img,qr]
var FVList = new Object();	//"ID":[No,No,No,No]
var qr_counter = 0;
Read_localStorage();
$('.m_playdate p').text('v0.39'+' RegistQR:'+Object.keys(RGList).length);

$(function() {
	console.log('***TEST***');
	add_area()

	$(document).on('click', '.m_dress>.m_dress_card', function(){
	url = $(this).find('img').attr('alt');
	if(typeof url !== "undefined"){
		if( $('.m_dress').hasClass('.l_detailCol') ){
			$('.l_detailCol').remove();
			$('.m_dress').append('<div class="l_detailCol"></div>');
		} else if( url.length != 1 || url == '-' ){
			url = '/digital_binders/lists/' + url +'/';
			$.ajax({type: "GET",
			url: url,
			dataType: 'html',
			async: true,
			success: function(data){
				res = $($(data).find('.m_dress_card'));
				$('.m_dress_area').empty();
				$('.m_dress_area').append(res);
				Read_localStorage();
				$(".m_card_area .m_dress_card").find("a").each(function(){
					c = $(this);
					g = $(this).prop('outerHTML').split("'");
					url_glitter = 'http://mypage.aikatsu.com' + g[1];
					var gres;
					$.ajax({type: "GET",
						url: url_glitter,
						async: true,
						success: function(data){
							cardnum = $(data).find('h5').html();
							n = cardnum.split(/[　 ]/);
							gres = $(data).find('.m_glitter-use dd');
							$(".m_card_area").find(".m_dress_card_name").each(function(){
								t = this.innerText.replace(/-/g,'‐');
								if( n[9] == t ){
									$(this).after(gres);
								}
							});
						}
					});
				});
				$('.m_card_area').fadeIn();
				$(".m_card_area").find(".m_dress_card_name").each(function(){
					t = this.innerText.replace(/-/g,'‐');
					for(key in RGList){
						if( t == key ){
							var options = qrcode_option();
							$(this).parent().parent().qrcode(options);
						}
					}
				});
				if( $('.m_card_area .m_dress_card').length > 6 ){
					$('.m_card_area').css('height', '390px');
				} else {
					$('.m_card_area').css('height', 'initial');
				}
		    }
		    });
		}
	} else {
		//所持カードリストでお気に入り処理
		Region = $(this).find('img').attr('src').split('_')[5].slice(0,1);
		switch(Region){
			case 't' : $('#Fav_display .w').empty(); break;
			case 'b' : $('#Fav_display .w').empty(); break;
			case 's' : break;
			case 'a' : break;
			case 'w' : 
				$('#Fav_display .t').empty();
				$('#Fav_display .b').empty();
			break;
		}

		$('#Fav_display .' + Region ).empty();
		var $cloneElem = $(this).clone();
		$cloneElem.appendTo( '#Fav_display .' + Region );
		$('#Fav_display').fadeIn();
		$('#Fav_display canvas').remove();
		$("#Fav_display").find(".m_dress_card_name").each(function(){
			t = this.innerText;
			for(key in RGList){
				if( t == key ){
					var options = qrcode_option();
					$(this).parent().parent().qrcode(options);
				}
			}
		});
	}
	});
	//QRコード単体表示
	$(document).on('click touchend', 'canvas', function(){
		$('#QR_display canvas').remove();
		newCanvas = cloneCanvas(this);
		$('#QR_display').append(newCanvas);
		$('#QR_display canvas').css({'width':'80px'});
	    $('#QR_display').fadeIn();
	});
	//QRコード単体表示エリア
	$(document).on('click touchend', '#QR_display .close', function(){
	    $('#QR_display').fadeOut();
	});
	//QRコード登録画面
	$(document).on('click', '.m_btn-qread', function(){
	$('.l_nav').fadeOut();
	    $('#qr_result').val('');
	    $('#QR_box').fadeIn();
	});
	//６枚表示閉じるボタン
	$(document).on('click', '.m_close', function(){
	    $('.m_card_area').fadeOut();
	});
	//所持QRのカードリストを表示
	$(document).on('click', '.m_btn-pos', function(){
		$('.dress_type,.dress_rare').show();
		$('.l_nav').fadeOut();
		$('.w,.t,.b,.s,.a,.m_dress').empty();
			$('.m_tit span').text('所持カードリスト');
			for(key in RGList){
				var Set = '';
				Set += '<li class="m_dress_card">';
				Set += '<a>';
				Set += '<div class="m_dress_card_img">';
				Set += '<img src="http://www.aikatsu.com/stars/images/cardlist/dressitem/'+RGList[key][1]+'/'+RGList[key][2]+'.png">';
				Set += '</div>';
				Set += '<div class="m_dress_card_name">' + key + '</div>';
				Set += '</a>';
				Set += '</li>';
				$('.m_dress').append(Set);
			}
    });
	//属性ソート
	$(document).on('click', '.chkbox', function(){
		QT = $('.chkbox-qt :checked').length;
		CO = $('.chkbox-co :checked').length;
		SE = $('.chkbox-se :checked').length;
		PO = $('.chkbox-po :checked').length;
		RC = $('.chkbox-c :checked').length;
		RP = $('.chkbox-p :checked').length;
		RR = $('.chkbox-r :checked').length;
		RN = $('.chkbox-n :checked').length;
		$('.m_dress .m_dress_card').find('img:first').each(function(i){
			mdc = $(this).parent().parent().parent();
			type = $(this).attr('src').split('_')[2];
			rare = $(this).attr('src').split('_')[3].slice(0,1);

			switch(type){
				case 'qt' : 
					if(QT==1){ mdc.show();
						switch(rare){
							case 'c' : if(RC==1){mdc.show();}else{mdc.hide()} break;
							case 'p' : if(RP==1){mdc.show();}else{mdc.hide()} break;
							case 'r' : if(RR==1){mdc.show();}else{mdc.hide()} break;
							case 'n' : if(RN==1){mdc.show();}else{mdc.hide()} break;
						} break;
					}
					if(QT==0){ mdc.hide(); break; }
				case 'co' : 
					if(CO==1){
						mdc.show();
						switch(rare){
							case 'c' : if(RC==1){mdc.show();}else{mdc.hide()} break;
							case 'p' : if(RP==1){mdc.show();}else{mdc.hide()} break;
							case 'r' : if(RR==1){mdc.show();}else{mdc.hide()} break;
							case 'n' : if(RN==1){mdc.show();}else{mdc.hide()} break;
						} break;
					}
					if(CO==0){ mdc.hide(); break; }
				case 'se' : 
					if(SE==1){
						mdc.show();
						switch(rare){
							case 'c' : if(RC==1){mdc.show();}else{mdc.hide()} break;
							case 'p' : if(RP==1){mdc.show();}else{mdc.hide()} break;
							case 'r' : if(RR==1){mdc.show();}else{mdc.hide()} break;
							case 'n' : if(RN==1){mdc.show();}else{mdc.hide()} break;
						} break;
					}
					if(SE==0){ mdc.hide(); break; }
				case 'po' : 
					if(PO==1){
						mdc.show();
						switch(rare){
							case 'c' : if(RC==1){mdc.show();}else{mdc.hide()} break;
							case 'p' : if(RP==1){mdc.show();}else{mdc.hide()} break;
							case 'r' : if(RR==1){mdc.show();}else{mdc.hide()} break;
							case 'n' : if(RN==1){mdc.show();}else{mdc.hide()} break;
						} break;
					}
					if(PO==0){ mdc.hide(); break; }
			}
		});
	});
	$(document).on('click', '#Fav_display .m_dress_card_img', function(){
		$(this).parent().parent().remove();
	});
	//お気に入り処理==================================================
	$(document).on('click', '#SetFav', function(){
		Read_localStorage();
		var t =[];
		$('#Fav_display').find('.m_dress_card_name').each(function(i){
			t[i] = $(this).text();
		});
		num = create_privateid(5);
		localStorage.setItem("FVList", JSON.stringify(FVList));
		FVList[num] = t;
		localStorage.setItem("FVList", JSON.stringify(FVList));
		alert('お気に入りへ保存しました');
	});
	//SetClose
	$(document).on('click touchend', '#SetClose', function(){
		$('.t,.b,.s,.a,.w').empty();
		$('#Fav_display').fadeOut();
	});
	//お気に入り削除処理==================================================
	$(document).on('click', '.fav_delete', function(){
		if(confirm('リストを削除しますか？')){
			fav_id = $(this).attr('title');
			delete FVList[fav_id];
			localStorage.setItem("FVList", JSON.stringify(FVList));
			$(this).parent().remove();
		}

	});
	//お気に入りページ==================================================
	$(document).on('click', '.m_btn-fav', function(){
		$('.l_nav').fadeOut();
		$('.m_dress').empty();
		$('#Fav_display').hide();
		$('.dress_type,.dress_rare').hide();
		$('.m_tit span').text('お気に入りリスト');

		var Set = '';
		for(key in FVList){
			var d = FVList[key].length;
			var Set = '<div class="favorite_list">';
				Set += '<p class="fav_delete" title="' + key + '">×</p>';
			for (var i = 0; i < d; i++){
				Set += '<li class="m_dress_card">';
				Set += '<a>';
				Set += '<div class="m_dress_card_img">';
				Set += '<img>';
				Set += '</div>';
				Set += '<div class="m_dress_card_name">' + FVList[key][i] + '</div>';
				Set += '</a>';
				Set += '</li>';
			}
			Set += '</div>';

			$('.m_dress').append(Set);

		} //end for
		for(key in RGList){
			$('.m_dress_card').find('.m_dress_card_name').each(function(){
				t = this.innerText;
				if( t == key ){
						var options = qrcode_option();
						$(this).parent().parent().qrcode(options);
				}
			});
		}

		for(key in RGList){
			Card_img = 'http://www.aikatsu.com/stars/images/cardlist/dressitem/'+RGList[key][1]+'/'+RGList[key][2]+'.png'; //公式から画像を取る

			$('.m_dress_card').find('.m_dress_card_name').each(function(i){
				if( this.innerText == key ){
					$(this).prev().children().attr("src",Card_img);
				}
			});
		}
	});
	//QRインポートボタン=================================================
	$(document).on('click', '#qrimp', function(){
		$('#qr_result').val('');
		qr_counter = 0;
    	var t=$('#imp_text').val();
		var qr_a = t.split(/\r\n|\r|\n/);
		var qr_ary = [];
		if( qr_a != '' ){
			$('.indicator').show();
			for (var i = 0; i < qr_a.length; ++i) {
				if (qr_a[i] !== '') qr_ary.push(qr_a[i]);
			}
			var len = qr_ary.length;
			$('.bar').css('width', '0%');
			for (var i = 0; i < len; i++){
				if( qr_ary[i].match(/http:\/\/dcd.sc\//) && qr_ary[i].length == 84 ){
					qr_ary[i] = qr_ary[i].replace(/j0\?i=/g,'j2?i=');
					import_qr(qr_ary[i],len);
				}else if( qr_ary[i].length == 0){
				}else{
					t = $('#qr_result').val();
					$('#qr_result').val( t + 'URLか文字数を確認してください:'+qr_ary[i]+'\n');
				}
			}
		}
      });
	//QRエクスポートボタン=================================================
	$(document).on('click', '#qrexp', function(){
    	$("#imp_text").val('');
		$('#qr_result').empty();
    	Read_localStorage();
    	append_List($('#imp_text'), RGList, false);
    	append_List($('#qr_result'), RGList, true);
    });
	//閉じるボタン=================================================
	$(document).on('click', '#close', function(){	
	    $('#QR_box').fadeOut();
	});
	//デジタルバインダー再表示
	$(document).on('click', '.m_btn-binder', function(){
	$('#Fav_display').fadeOut();
	$('.l_nav').fadeOut();
	$('.dress_type,.dress_rare').show();	
	$('.m_dress').empty();
	//カード表示エリア
	$('.m_dress').append('<div class="m_card_area"><div class="m_btn"><p class="m_close">×</p></div><div class="m_dress_area"></div></div>');

		$.ajax({type: 'GET',
		url: 'http://mypage.aikatsu.com/digital_binders/',
		async: true,
			success: function(data){
				page = $(data).find('.m_dress').html();
				title= $(data).find('.m_tit span').html();
				$('.m_dress').append(page);
				$('.m_dress_card a').removeAttr('href');
				$('.m_tit span').text(title);
			}
		});
	});
});// end================================================================================= 

/*function==============================================================================*/
function qrcode_option(){
	var options = {
	render: 'canvas',
	ecLevel: 'H',
	minVersion: 8,
	fill: '#000000',
	background: '#ffffff',
	text: RGList[key][3],
	size: 120,
	radius: 0,
	quiet: 1,
	mode: 0,
	mSize: 0,
	mPosX: 0,
	mPosY: 0,
	fontname: '',
	fontcolor: '#000000',
	};
	return options;
};
function add_area(){
	$('head link:last').after('<link rel="stylesheet" href="https://rawgit.com/mryooo/db/master/style.css">');

	$('.m_dress').append("<script>function loadDetail(url){$('.l_detailCol').load(url,null,function(){$('.m_btn').click(function(){$('.l_detailCol').remove();$('.m_dress').append('<div class=l_detailCol></div>');});});}</script>");
	//カード表示エリア
	$('.m_dress').append('<div class="m_card_area"><div class="m_btn"><p class="m_close">×</p></div><div class="m_dress_area"></div></div>');
	//単カード表示エリア
	$('.m_dress').append('<div class="l_detailCol"></div>');

	$('.m_btn-binder').remove();
	//メニューボタン追加
	$('.l_nav .m_link :nth-last-child(2)').after('<li class="m_btn-binder">デジタルバインダー</li>');
	$('.l_nav .m_link :nth-last-child(2)').after('<li class="m_btn-qread">QRCode</li>');
	$('.l_nav .m_link :nth-last-child(2)').after('<li class="m_btn-pos">所持List</li>');
	$('.l_nav .m_link :nth-last-child(2)').after('<li class="m_btn-fav">お気に入り</li>');

	//QRインポートエリア
	$('.l_footer').prepend('<div id="QR_box"><h1>QRCode Import</h1>インポートするQRコードの読取結果を入力してください。<br>（http://dcd.sc/j2?i=... 複数可）<textarea id="imp_text" wrap="off"></textarea><p id="qrimp">インポート</p><p id="qrexp">エクスポート</p><p id="close">Close</p><textarea id="qr_result" readonly wrap="off"></textarea><div class="indicator"><div class="bar">-</div></div></div>');
	$('.l_footer').prepend('<div id="QR_display"><div class="close">×</div><div class="tops"></div><div class="bottoms"></div><div class="shoes"></div><div class="accessory"></div></div>');
	$('.l_footer').prepend('<div id="Fav_display"><div class="w"></div><div class="t"></div><div class="b"></div><div class="s"></div><div class="a"></div><div id="fav_btn_set"><p id="SetFav">お気に入り</p><p id="SetClose">Close</p></div></div>');

	//属性/レアリティソート追加
	$('.m_inner').prepend('<div class="dress_type"><label class="chkbox chkbox-qt"><input type="checkbox" checked><span></span></label><label class="chkbox chkbox-co"><input type="checkbox" checked><span></span></label><label class="chkbox chkbox-se"><input type="checkbox" checked><span></span></label><label class="chkbox chkbox-po"><input type="checkbox" checked><span></span></label></div><div class="dress_rare"><label class="chkbox chkbox-c"><input type="checkbox"><span>C</span></label><label class="chkbox chkbox-p"><input type="checkbox"><span>P</span></label><label class="chkbox chkbox-r"><input type="checkbox"><span>R</span></label><label class="chkbox chkbox-n"><input type="checkbox"><span>N</span></label></div>');

	//ボタン削除
	$('.m_btn-mydata,.m_btn-results,.m_btn-movie,.m_btn-back02,.m_btn-sec-gray,.m_btn-conf,.m_btn-logout').remove();
	//クリック時の処理を消す
	$('.m_dress_card a').removeAttr('href');
}

function append_List(htmlobject, List, flag){
	var list = '';
	$.each(List, function(index, value){
		if(flag){
			list = list + index + ',' + value[0] +'\n';
		} else {
			list = list + value[3] + '\n';
		}
	});
	$(htmlobject).val(list);
}

// localStorageからQRを読み出し
function Read_localStorage() {
	if(JSON.parse(localStorage.getItem("RGList"))){
		RGList = JSON.parse(localStorage.getItem("RGList"));
	}
	if(JSON.parse(localStorage.getItem("FVList"))){
		FVList = JSON.parse(localStorage.getItem("FVList"));
	}
}

// インポートしたQRのURLにアクセスする。取得したカードIDをlocalStorageに格納する
function import_qr(url,len) {
	$.ajax({
	type: "GET",
	url: url,
	async: false,
	success: function(data){
			CardNum = $(data.responseText).find('.dress-detail-title p').html().split('　');
    		CardName = $(data.responseText).find('.dress-detail-title h4').html();
    		CardUrl = $(data.responseText).find('.dress-detail-img img').attr('src').split('/');
    		str_img = CardUrl[5].split('.');
			t = $('#qr_result').val();
			if( CardNum[1].split('-').length == 3 ){
				CardNum[1] = CardNum[0]+'-'+CardNum[1];			
			}

			qr_counter = qr_counter + 1;
			p = Math.ceil((qr_counter/len)*100)+'%';
			o = Math.ceil(parseInt($('.bar').css('width'))/parseInt($('.indicator').css('width'))*100);
			if(o<=parseInt(p)){
				$('.bar').css('width', p);
				$('.bar').text(p)
			}
			if(parseInt(p)>=95){
				$('.indicator').fadeOut(3000);
			}

			if (typeof CardNum[1] === "undefined") {
				$('#qr_result').val( t + 'URL Not Found:'+url+'\n');
				$("#qr_result").animate({scrollTop: 10000},{queue:false});
				return;
			}
			for(key in RGList){
				if(CardNum[1].replace(/-/g,'‐')==key){ //重複時
				$('#qr_result').val( t + '重複:'+url+'\n');
				$("#qr_result").animate({scrollTop: 10000},{queue:false});
				return;
				}
			}

			$('#qr_result').val(t + CardNum[1]+','+CardName+'\n');

			localStorage.setItem("RGList", JSON.stringify(RGList));
			RGList[CardNum[1]] = [CardName,CardUrl[4],str_img[0],url];

			localStorage.clear();

			CardNumSort(RGList)
			localStorage.setItem("RGList", JSON.stringify(ary_storage));
			$("#qr_result").animate({scrollTop: 10000},{queue:false});
		}
	});
}
// Canvasのオブジェクトをコピーする
function cloneCanvas(oldCanvas) {
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;
    context.drawImage(oldCanvas, 0, 0);
    return newCanvas;
}
//ソート処理
function CardNumSort(localStorage){
	var ary = [];
	for(key in localStorage){
		if( key.match(/-/) ){
			s=key.split('-');
		} else {
			s=key.split('‐');	
		}
		if(isNaN(s[0])){
	        c=(s[0]).slice(-2)+'‐'+('0'+s[1]).slice(-2)+'‐'+s[2]+'‐'+s[3];
		} else {
	        c=('0'+s[0]).slice(-2)+'‐'+('0'+s[1]).slice(-2)+'‐'+s[2]+'‐'+s[3];
		}
        ary.push(c+'‐'+localStorage[key][0]+'‐'+localStorage[key][1]+'‐'+localStorage[key][2]+'‐'+localStorage[key][3]);    //No,QRURL格納
	}
	ary.sort();
	var CardList = [];
	var sort_ary = {};
	for( var i=0;i<ary.length;i++){
		s=ary[i].split('‐');
        if(isNaN(s[0])){
            c=s[0]+'‐'+Number(s[1])+'‐'+s[2]+'‐'+s[3];
        }else{
            c=Number(s[0])+'‐'+Number(s[1])+'‐'+s[2]+'‐'+s[3];
        }
        sort_ary[c] = [s[4],s[5],s[6],s[7]];
	}
	ary_storage = sort_ary;
};
//乱数生成
function create_privateid( n ){
    var CODE_TABLE = "0123456789"
        + "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        + "abcdefghijklmnopqrstuvwxyz";
    var r = "";
    for (var i = 0, k = CODE_TABLE.length; i < n; i++){
        r += CODE_TABLE.charAt(Math.floor(k * Math.random()));
    }
    return r;
}

//jquery.xdomainajax.js
jQuery.ajax = (function(_ajax){    
    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';
    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }    
    return function(o) {
        var url = o.url;
        if ( /get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url) ) {
            o.url = YQL;
            o.dataType = 'json';
            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }
            o.success = (function(_success){
                return function(data) {
                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: (data.results[0] || '')
                                // YQL screws with <script>s
                                // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }
                };
            })(o.success);
        }
        return _ajax.apply(this, arguments);
    };
})(jQuery.ajax);

//jquery.qrcode.min.js
!function(r){"use strict";function t(t,e,n,o){function i(r,t){return r-=o,t-=o,0>r||r>=u||0>t||t>=u?!1:a.isDark(r,t)}var a=r(n,e);a.addData(t),a.make(),o=o||0;var u=a.getModuleCount(),f=a.getModuleCount()+2*o,c=function(r,t,e,n){var o=this.isDark,i=1/f;this.isDark=function(a,u){var f=u*i,c=a*i,l=f+i,g=c+i;return o(a,u)&&(r>l||f>e||t>g||c>n)}};this.text=t,this.level=e,this.version=n,this.moduleCount=f,this.isDark=i,this.addBlank=c}function e(r,e,n,o,i){n=Math.max(1,n||1),o=Math.min(40,o||40);for(var a=n;o>=a;a+=1)try{return new t(r,e,a,i)}catch(u){}}function n(r,t,e){var n=e.size,o="bold "+e.mSize*n+"px "+e.fontname,i=w("<canvas/>")[0].getContext("2d");i.font=o;var a=i.measureText(e.label).width,u=e.mSize,f=a/n,c=(1-f)*e.mPosX,l=(1-u)*e.mPosY,g=c+f,s=l+u,h=.01;1===e.mode?r.addBlank(0,l-h,n,s+h):r.addBlank(c-h,l-h,g+h,s+h),t.fillStyle=e.fontcolor,t.font=o,t.fillText(e.label,c*n,l*n+.75*e.mSize*n)}function o(r,t,e){var n=e.size,o=e.image.naturalWidth||1,i=e.image.naturalHeight||1,a=e.mSize,u=a*o/i,f=(1-u)*e.mPosX,c=(1-a)*e.mPosY,l=f+u,g=c+a,s=.01;3===e.mode?r.addBlank(0,c-s,n,g+s):r.addBlank(f-s,c-s,l+s,g+s),t.drawImage(e.image,f*n,c*n,u*n,a*n)}function i(r,t,e){w(e.background).is("img")?t.drawImage(e.background,0,0,e.size,e.size):e.background&&(t.fillStyle=e.background,t.fillRect(e.left,e.top,e.size,e.size));var i=e.mode;1===i||2===i?n(r,t,e):(3===i||4===i)&&o(r,t,e)}function a(r,t,e,n,o,i,a,u){r.isDark(a,u)&&t.rect(n,o,i,i)}function u(r,t,e,n,o,i,a,u,f,c){a?r.moveTo(t+i,e):r.moveTo(t,e),u?(r.lineTo(n-i,e),r.arcTo(n,e,n,o,i)):r.lineTo(n,e),f?(r.lineTo(n,o-i),r.arcTo(n,o,t,o,i)):r.lineTo(n,o),c?(r.lineTo(t+i,o),r.arcTo(t,o,t,e,i)):r.lineTo(t,o),a?(r.lineTo(t,e+i),r.arcTo(t,e,n,e,i)):r.lineTo(t,e)}function f(r,t,e,n,o,i,a,u,f,c){a&&(r.moveTo(t+i,e),r.lineTo(t,e),r.lineTo(t,e+i),r.arcTo(t,e,t+i,e,i)),u&&(r.moveTo(n-i,e),r.lineTo(n,e),r.lineTo(n,e+i),r.arcTo(n,e,n-i,e,i)),f&&(r.moveTo(n-i,o),r.lineTo(n,o),r.lineTo(n,o-i),r.arcTo(n,o,n-i,o,i)),c&&(r.moveTo(t+i,o),r.lineTo(t,o),r.lineTo(t,o-i),r.arcTo(t,o,t+i,o,i))}function c(r,t,e,n,o,i,a,c){var l=r.isDark,g=n+i,s=o+i,h=e.radius*i,v=a-1,d=a+1,w=c-1,m=c+1,p=l(a,c),y=l(v,w),T=l(v,c),B=l(v,m),A=l(a,m),E=l(d,m),k=l(d,c),M=l(d,w),C=l(a,w);p?u(t,n,o,g,s,h,!T&&!C,!T&&!A,!k&&!A,!k&&!C):f(t,n,o,g,s,h,T&&C&&y,T&&A&&B,k&&A&&E,k&&C&&M)}function l(r,t,e){var n,o,i=r.moduleCount,u=e.size/i,f=a;for(p&&e.radius>0&&e.radius<=.5&&(f=c),t.beginPath(),n=0;i>n;n+=1)for(o=0;i>o;o+=1){var l=e.left+o*u,g=e.top+n*u,s=u;f(r,t,e,l,g,s,n,o)}if(w(e.fill).is("img")){t.strokeStyle="rgba(0,0,0,0.5)",t.lineWidth=2,t.stroke();var h=t.globalCompositeOperation;t.globalCompositeOperation="destination-out",t.fill(),t.globalCompositeOperation=h,t.clip(),t.drawImage(e.fill,0,0,e.size,e.size),t.restore()}else t.fillStyle=e.fill,t.fill()}function g(r,t){var n=e(t.text,t.ecLevel,t.minVersion,t.maxVersion,t.quiet);if(!n)return null;var o=w(r).data("qrcode",n),a=o[0].getContext("2d");return i(n,a,t),l(n,a,t),o}function s(r){var t=w("<canvas/>").attr("width",r.size).attr("height",r.size);return g(t,r)}function h(r){return w("<img/>").attr("src",s(r)[0].toDataURL("image/png"))}function v(r){var t=e(r.text,r.ecLevel,r.minVersion,r.maxVersion,r.quiet);if(!t)return null;var n,o,i=r.size,a=r.background,u=Math.floor,f=t.moduleCount,c=u(i/f),l=u(.5*(i-c*f)),g={position:"relative",left:0,top:0,padding:0,margin:0,width:i,height:i},s={position:"absolute",padding:0,margin:0,width:c,height:c,"background-color":r.fill},h=w("<div/>").data("qrcode",t).css(g);for(a&&h.css("background-color",a),n=0;f>n;n+=1)for(o=0;f>o;o+=1)t.isDark(n,o)&&w("<div/>").css(s).css({left:l+o*c,top:l+n*c}).appendTo(h);return h}function d(r){return m&&"canvas"===r.render?s(r):m&&"image"===r.render?h(r):v(r)}var w=jQuery,m=function(){var r=document.createElement("canvas");return Boolean(r.getContext&&r.getContext("2d"))}(),p="[object Opera]"!==Object.prototype.toString.call(window.opera),y={render:"canvas",minVersion:1,maxVersion:40,ecLevel:"L",left:0,top:0,size:200,fill:"#000",background:null,text:"no text",radius:0,quiet:0,mode:0,mSize:.1,mPosX:.5,mPosY:.5,label:"no label",fontname:"sans",fontcolor:"#000",image:null};w.fn.qrcode=function(r){var t=w.extend({},y,r);return this.each(function(){"canvas"===this.nodeName.toLowerCase()?g(this,t):w(this).append(d(t))})}}(function(){var r=function(){function r(t,e){if("undefined"==typeof t.length)throw new Error(t.length+"/"+e);var n=function(){for(var r=0;r<t.length&&0==t[r];)r+=1;for(var n=new Array(t.length-r+e),o=0;o<t.length-r;o+=1)n[o]=t[o+r];return n}(),o={};return o.getAt=function(r){return n[r]},o.getLength=function(){return n.length},o.multiply=function(t){for(var e=new Array(o.getLength()+t.getLength()-1),n=0;n<o.getLength();n+=1)for(var i=0;i<t.getLength();i+=1)e[n+i]^=a.gexp(a.glog(o.getAt(n))+a.glog(t.getAt(i)));return r(e,0)},o.mod=function(t){if(o.getLength()-t.getLength()<0)return o;for(var e=a.glog(o.getAt(0))-a.glog(t.getAt(0)),n=new Array(o.getLength()),i=0;i<o.getLength();i+=1)n[i]=o.getAt(i);for(var i=0;i<t.getLength();i+=1)n[i]^=a.gexp(a.glog(t.getAt(i))+e);return r(n,0).mod(t)},o}var t=function(t,e){var o=236,a=17,l=t,g=n[e],s=null,h=0,d=null,w=new Array,m={},p=function(r,t){h=4*l+17,s=function(r){for(var t=new Array(r),e=0;r>e;e+=1){t[e]=new Array(r);for(var n=0;r>n;n+=1)t[e][n]=null}return t}(h),y(0,0),y(h-7,0),y(0,h-7),A(),B(),k(r,t),l>=7&&E(r),null==d&&(d=D(l,g,w)),M(d,t)},y=function(r,t){for(var e=-1;7>=e;e+=1)if(!(-1>=r+e||r+e>=h))for(var n=-1;7>=n;n+=1)-1>=t+n||t+n>=h||(e>=0&&6>=e&&(0==n||6==n)||n>=0&&6>=n&&(0==e||6==e)||e>=2&&4>=e&&n>=2&&4>=n?s[r+e][t+n]=!0:s[r+e][t+n]=!1)},T=function(){for(var r=0,t=0,e=0;8>e;e+=1){p(!0,e);var n=i.getLostPoint(m);(0==e||r>n)&&(r=n,t=e)}return t},B=function(){for(var r=8;h-8>r;r+=1)null==s[r][6]&&(s[r][6]=r%2==0);for(var t=8;h-8>t;t+=1)null==s[6][t]&&(s[6][t]=t%2==0)},A=function(){for(var r=i.getPatternPosition(l),t=0;t<r.length;t+=1)for(var e=0;e<r.length;e+=1){var n=r[t],o=r[e];if(null==s[n][o])for(var a=-2;2>=a;a+=1)for(var u=-2;2>=u;u+=1)-2==a||2==a||-2==u||2==u||0==a&&0==u?s[n+a][o+u]=!0:s[n+a][o+u]=!1}},E=function(r){for(var t=i.getBCHTypeNumber(l),e=0;18>e;e+=1){var n=!r&&1==(t>>e&1);s[Math.floor(e/3)][e%3+h-8-3]=n}for(var e=0;18>e;e+=1){var n=!r&&1==(t>>e&1);s[e%3+h-8-3][Math.floor(e/3)]=n}},k=function(r,t){for(var e=g<<3|t,n=i.getBCHTypeInfo(e),o=0;15>o;o+=1){var a=!r&&1==(n>>o&1);6>o?s[o][8]=a:8>o?s[o+1][8]=a:s[h-15+o][8]=a}for(var o=0;15>o;o+=1){var a=!r&&1==(n>>o&1);8>o?s[8][h-o-1]=a:9>o?s[8][15-o-1+1]=a:s[8][15-o-1]=a}s[h-8][8]=!r},M=function(r,t){for(var e=-1,n=h-1,o=7,a=0,u=i.getMaskFunction(t),f=h-1;f>0;f-=2)for(6==f&&(f-=1);;){for(var c=0;2>c;c+=1)if(null==s[n][f-c]){var l=!1;a<r.length&&(l=1==(r[a]>>>o&1));var g=u(n,f-c);g&&(l=!l),s[n][f-c]=l,o-=1,-1==o&&(a+=1,o=7)}if(n+=e,0>n||n>=h){n-=e,e=-e;break}}},C=function(t,e){for(var n=0,o=0,a=0,u=new Array(e.length),f=new Array(e.length),c=0;c<e.length;c+=1){var l=e[c].dataCount,g=e[c].totalCount-l;o=Math.max(o,l),a=Math.max(a,g),u[c]=new Array(l);for(var s=0;s<u[c].length;s+=1)u[c][s]=255&t.getBuffer()[s+n];n+=l;var h=i.getErrorCorrectPolynomial(g),v=r(u[c],h.getLength()-1),d=v.mod(h);f[c]=new Array(h.getLength()-1);for(var s=0;s<f[c].length;s+=1){var w=s+d.getLength()-f[c].length;f[c][s]=w>=0?d.getAt(w):0}}for(var m=0,s=0;s<e.length;s+=1)m+=e[s].totalCount;for(var p=new Array(m),y=0,s=0;o>s;s+=1)for(var c=0;c<e.length;c+=1)s<u[c].length&&(p[y]=u[c][s],y+=1);for(var s=0;a>s;s+=1)for(var c=0;c<e.length;c+=1)s<f[c].length&&(p[y]=f[c][s],y+=1);return p},D=function(r,t,e){for(var n=u.getRSBlocks(r,t),c=f(),l=0;l<e.length;l+=1){var g=e[l];c.put(g.getMode(),4),c.put(g.getLength(),i.getLengthInBits(g.getMode(),r)),g.write(c)}for(var s=0,l=0;l<n.length;l+=1)s+=n[l].dataCount;if(c.getLengthInBits()>8*s)throw new Error("code length overflow. ("+c.getLengthInBits()+">"+8*s+")");for(c.getLengthInBits()+4<=8*s&&c.put(0,4);c.getLengthInBits()%8!=0;)c.putBit(!1);for(;;){if(c.getLengthInBits()>=8*s)break;if(c.put(o,8),c.getLengthInBits()>=8*s)break;c.put(a,8)}return C(c,n)};return m.addData=function(r){var t=c(r);w.push(t),d=null},m.isDark=function(r,t){if(0>r||r>=h||0>t||t>=h)throw new Error(r+","+t);return s[r][t]},m.getModuleCount=function(){return h},m.make=function(){p(!1,T())},m.createTableTag=function(r,t){r=r||2,t="undefined"==typeof t?4*r:t;var e="";e+='<table style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: "+t+"px;",e+='">',e+="<tbody>";for(var n=0;n<m.getModuleCount();n+=1){e+="<tr>";for(var o=0;o<m.getModuleCount();o+=1)e+='<td style="',e+=" border-width: 0px; border-style: none;",e+=" border-collapse: collapse;",e+=" padding: 0px; margin: 0px;",e+=" width: "+r+"px;",e+=" height: "+r+"px;",e+=" background-color: ",e+=m.isDark(n,o)?"#000000":"#ffffff",e+=";",e+='"/>';e+="</tr>"}return e+="</tbody>",e+="</table>"},m.createImgTag=function(r,t){r=r||2,t="undefined"==typeof t?4*r:t;var e=m.getModuleCount()*r+2*t,n=t,o=e-t;return v(e,e,function(t,e){if(t>=n&&o>t&&e>=n&&o>e){var i=Math.floor((t-n)/r),a=Math.floor((e-n)/r);return m.isDark(a,i)?0:1}return 1})},m};t.stringToBytes=function(r){for(var t=new Array,e=0;e<r.length;e+=1){var n=r.charCodeAt(e);t.push(255&n)}return t},t.createStringToBytes=function(r,t){var e=function(){for(var e=s(r),n=function(){var r=e.read();if(-1==r)throw new Error;return r},o=0,i={};;){var a=e.read();if(-1==a)break;var u=n(),f=n(),c=n(),l=String.fromCharCode(a<<8|u),g=f<<8|c;i[l]=g,o+=1}if(o!=t)throw new Error(o+" != "+t);return i}(),n="?".charCodeAt(0);return function(r){for(var t=new Array,o=0;o<r.length;o+=1){var i=r.charCodeAt(o);if(128>i)t.push(i);else{var a=e[r.charAt(o)];"number"==typeof a?(255&a)==a?t.push(a):(t.push(a>>>8),t.push(255&a)):t.push(n)}}return t}};var e={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},n={L:1,M:0,Q:3,H:2},o={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},i=function(){var t=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],n=1335,i=7973,u=21522,f={},c=function(r){for(var t=0;0!=r;)t+=1,r>>>=1;return t};return f.getBCHTypeInfo=function(r){for(var t=r<<10;c(t)-c(n)>=0;)t^=n<<c(t)-c(n);return(r<<10|t)^u},f.getBCHTypeNumber=function(r){for(var t=r<<12;c(t)-c(i)>=0;)t^=i<<c(t)-c(i);return r<<12|t},f.getPatternPosition=function(r){return t[r-1]},f.getMaskFunction=function(r){switch(r){case o.PATTERN000:return function(r,t){return(r+t)%2==0};case o.PATTERN001:return function(r,t){return r%2==0};case o.PATTERN010:return function(r,t){return t%3==0};case o.PATTERN011:return function(r,t){return(r+t)%3==0};case o.PATTERN100:return function(r,t){return(Math.floor(r/2)+Math.floor(t/3))%2==0};case o.PATTERN101:return function(r,t){return r*t%2+r*t%3==0};case o.PATTERN110:return function(r,t){return(r*t%2+r*t%3)%2==0};case o.PATTERN111:return function(r,t){return(r*t%3+(r+t)%2)%2==0};default:throw new Error("bad maskPattern:"+r)}},f.getErrorCorrectPolynomial=function(t){for(var e=r([1],0),n=0;t>n;n+=1)e=e.multiply(r([1,a.gexp(n)],0));return e},f.getLengthInBits=function(r,t){if(t>=1&&10>t)switch(r){case e.MODE_NUMBER:return 10;case e.MODE_ALPHA_NUM:return 9;case e.MODE_8BIT_BYTE:return 8;case e.MODE_KANJI:return 8;default:throw new Error("mode:"+r)}else if(27>t)switch(r){case e.MODE_NUMBER:return 12;case e.MODE_ALPHA_NUM:return 11;case e.MODE_8BIT_BYTE:return 16;case e.MODE_KANJI:return 10;default:throw new Error("mode:"+r)}else{if(!(41>t))throw new Error("type:"+t);switch(r){case e.MODE_NUMBER:return 14;case e.MODE_ALPHA_NUM:return 13;case e.MODE_8BIT_BYTE:return 16;case e.MODE_KANJI:return 12;default:throw new Error("mode:"+r)}}},f.getLostPoint=function(r){for(var t=r.getModuleCount(),e=0,n=0;t>n;n+=1)for(var o=0;t>o;o+=1){for(var i=0,a=r.isDark(n,o),u=-1;1>=u;u+=1)if(!(0>n+u||n+u>=t))for(var f=-1;1>=f;f+=1)0>o+f||o+f>=t||(0!=u||0!=f)&&a==r.isDark(n+u,o+f)&&(i+=1);i>5&&(e+=3+i-5)}for(var n=0;t-1>n;n+=1)for(var o=0;t-1>o;o+=1){var c=0;r.isDark(n,o)&&(c+=1),r.isDark(n+1,o)&&(c+=1),r.isDark(n,o+1)&&(c+=1),r.isDark(n+1,o+1)&&(c+=1),(0==c||4==c)&&(e+=3)}for(var n=0;t>n;n+=1)for(var o=0;t-6>o;o+=1)r.isDark(n,o)&&!r.isDark(n,o+1)&&r.isDark(n,o+2)&&r.isDark(n,o+3)&&r.isDark(n,o+4)&&!r.isDark(n,o+5)&&r.isDark(n,o+6)&&(e+=40);for(var o=0;t>o;o+=1)for(var n=0;t-6>n;n+=1)r.isDark(n,o)&&!r.isDark(n+1,o)&&r.isDark(n+2,o)&&r.isDark(n+3,o)&&r.isDark(n+4,o)&&!r.isDark(n+5,o)&&r.isDark(n+6,o)&&(e+=40);for(var l=0,o=0;t>o;o+=1)for(var n=0;t>n;n+=1)r.isDark(n,o)&&(l+=1);var g=Math.abs(100*l/t/t-50)/5;return e+=10*g},f}(),a=function(){for(var r=new Array(256),t=new Array(256),e=0;8>e;e+=1)r[e]=1<<e;for(var e=8;256>e;e+=1)r[e]=r[e-4]^r[e-5]^r[e-6]^r[e-8];for(var e=0;255>e;e+=1)t[r[e]]=e;var n={};return n.glog=function(r){if(1>r)throw new Error("glog("+r+")");return t[r]},n.gexp=function(t){for(;0>t;)t+=255;for(;t>=256;)t-=255;return r[t]},n}(),u=function(){var r=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12,7,37,13],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],t=function(r,t){var e={};return e.totalCount=r,e.dataCount=t,e},e={},o=function(t,e){switch(e){case n.L:return r[4*(t-1)+0];case n.M:return r[4*(t-1)+1];case n.Q:return r[4*(t-1)+2];case n.H:return r[4*(t-1)+3];default:return void 0}};return e.getRSBlocks=function(r,e){var n=o(r,e);if("undefined"==typeof n)throw new Error("bad rs block @ typeNumber:"+r+"/errorCorrectLevel:"+e);for(var i=n.length/3,a=new Array,u=0;i>u;u+=1)for(var f=n[3*u+0],c=n[3*u+1],l=n[3*u+2],g=0;f>g;g+=1)a.push(t(c,l));return a},e}(),f=function(){var r=new Array,t=0,e={};return e.getBuffer=function(){return r},e.getAt=function(t){var e=Math.floor(t/8);return 1==(r[e]>>>7-t%8&1)},e.put=function(r,t){for(var n=0;t>n;n+=1)e.putBit(1==(r>>>t-n-1&1))},e.getLengthInBits=function(){return t},e.putBit=function(e){var n=Math.floor(t/8);r.length<=n&&r.push(0),e&&(r[n]|=128>>>t%8),t+=1},e},c=function(r){var n=e.MODE_8BIT_BYTE,o=t.stringToBytes(r),i={};return i.getMode=function(){return n},i.getLength=function(r){return o.length},i.write=function(r){for(var t=0;t<o.length;t+=1)r.put(o[t],8)},i},l=function(){var r=new Array,t={};return t.writeByte=function(t){r.push(255&t)},t.writeShort=function(r){t.writeByte(r),t.writeByte(r>>>8)},t.writeBytes=function(r,e,n){e=e||0,n=n||r.length;for(var o=0;n>o;o+=1)t.writeByte(r[o+e])},t.writeString=function(r){for(var e=0;e<r.length;e+=1)t.writeByte(r.charCodeAt(e))},t.toByteArray=function(){return r},t.toString=function(){var t="";t+="[";for(var e=0;e<r.length;e+=1)e>0&&(t+=","),t+=r[e];return t+="]"},t},g=function(){var r=0,t=0,e=0,n="",o={},i=function(r){n+=String.fromCharCode(a(63&r))},a=function(r){if(0>r);else{if(26>r)return 65+r;if(52>r)return 97+(r-26);if(62>r)return 48+(r-52);if(62==r)return 43;if(63==r)return 47}throw new Error("n:"+r)};return o.writeByte=function(n){for(r=r<<8|255&n,t+=8,e+=1;t>=6;)i(r>>>t-6),t-=6},o.flush=function(){if(t>0&&(i(r<<6-t),r=0,t=0),e%3!=0)for(var o=3-e%3,a=0;o>a;a+=1)n+="="},o.toString=function(){return n},o},s=function(r){var t=r,e=0,n=0,o=0,i={};i.read=function(){for(;8>o;){if(e>=t.length){if(0==o)return-1;throw new Error("unexpected end of file./"+o)}var r=t.charAt(e);if(e+=1,"="==r)return o=0,-1;r.match(/^\s$/)||(n=n<<6|a(r.charCodeAt(0)),o+=6)}var i=n>>>o-8&255;return o-=8,i};var a=function(r){if(r>=65&&90>=r)return r-65;if(r>=97&&122>=r)return r-97+26;if(r>=48&&57>=r)return r-48+52;if(43==r)return 62;if(47==r)return 63;throw new Error("c:"+r)};return i},h=function(r,t){var e=r,n=t,o=new Array(r*t),i={};i.setPixel=function(r,t,n){o[t*e+r]=n},i.write=function(r){r.writeString("GIF87a"),r.writeShort(e),r.writeShort(n),r.writeByte(128),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(0),r.writeByte(255),r.writeByte(255),r.writeByte(255),r.writeString(","),r.writeShort(0),r.writeShort(0),r.writeShort(e),r.writeShort(n),r.writeByte(0);var t=2,o=u(t);r.writeByte(t);for(var i=0;o.length-i>255;)r.writeByte(255),r.writeBytes(o,i,255),i+=255;r.writeByte(o.length-i),r.writeBytes(o,i,o.length-i),r.writeByte(0),r.writeString(";")};var a=function(r){var t=r,e=0,n=0,o={};return o.write=function(r,o){if(r>>>o!=0)throw new Error("length over");for(;e+o>=8;)t.writeByte(255&(r<<e|n)),o-=8-e,r>>>=8-e,n=0,e=0;n=r<<e|n,e+=o},o.flush=function(){e>0&&t.writeByte(n)},o},u=function(r){for(var t=1<<r,e=(1<<r)+1,n=r+1,i=f(),u=0;t>u;u+=1)i.add(String.fromCharCode(u));i.add(String.fromCharCode(t)),i.add(String.fromCharCode(e));var c=l(),g=a(c);g.write(t,n);var s=0,h=String.fromCharCode(o[s]);for(s+=1;s<o.length;){var v=String.fromCharCode(o[s]);s+=1,i.contains(h+v)?h+=v:(g.write(i.indexOf(h),n),i.size()<4095&&(i.size()==1<<n&&(n+=1),i.add(h+v)),h=v)}return g.write(i.indexOf(h),n),g.write(e,n),g.flush(),c.toByteArray()},f=function(){var r={},t=0,e={};return e.add=function(n){if(e.contains(n))throw new Error("dup key:"+n);r[n]=t,t+=1},e.size=function(){return t},e.indexOf=function(t){return r[t]},e.contains=function(t){return"undefined"!=typeof r[t]},e};return i},v=function(r,t,e,n){for(var o=h(r,t),i=0;t>i;i+=1)for(var a=0;r>a;a+=1)o.setPixel(a,i,e(a,i));var u=l();o.write(u);for(var f=g(),c=u.toByteArray(),s=0;s<c.length;s+=1)f.writeByte(c[s]);f.flush();var v="";return v+="<img",v+=' src="',v+="data:image/gif;base64,",v+=f,v+='"',v+=' width="',v+=r,v+='"',v+=' height="',v+=t,v+='"',n&&(v+=' alt="',v+=n,v+='"'),v+="/>"};return t}();return function(r){"function"==typeof define&&define.amd?define([],r):"object"==typeof exports&&(module.exports=r())}(function(){return r}),!function(r){r.stringToBytes=function(r){function t(r){for(var t=[],e=0;e<r.length;e++){var n=r.charCodeAt(e);128>n?t.push(n):2048>n?t.push(192|n>>6,128|63&n):55296>n||n>=57344?t.push(224|n>>12,128|n>>6&63,128|63&n):(e++,n=65536+((1023&n)<<10|1023&r.charCodeAt(e)),t.push(240|n>>18,128|n>>12&63,128|n>>6&63,128|63&n))}return t}return t(r)}}(r),r}());