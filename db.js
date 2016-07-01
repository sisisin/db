var ary_storage = {};
var RGList = new Object();	//"No":[name,ver,img,qr]
var FVList = new Object();	//"ID":[No,No,No,No]
var qr_counter = 0;
Read_localStorage();
$('.m_playdate p').text('v0.38'+' RegistQR:'+Object.keys(RGList).length);

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
					t = this.innerText;
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
	javascript:$.getScript('https://dl.dropboxusercontent.com/u/3625132/bookmarklet/jquery.xdomainajax.js');
	javascript:$.getScript('https://dl.dropboxusercontent.com/u/3625132/bookmarklet/jquery.qrcode.min.js');
	$('head link:last').after('<link rel="stylesheet" href="https://dl.dropboxusercontent.com/u/3625132/bookmarklet/style.css">');

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

/*
2016/06/22 v0.36 QR インポート時のインジケーターを追加
2016/06/23 v0.37 プロモ、ブロマイドを読込み可能に修正
2016/06/23 v0.38 重複登録時の処理を追加
*/