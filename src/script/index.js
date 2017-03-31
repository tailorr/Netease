// 适配viewport
var scale = 1 / window.devicePixelRatio;
var meta = createNode('meta');
meta.setAttribute('name', "viewport");
meta.setAttribute('content', "user-scalable=no,initial-scale=" + scale + ",minimum-scale=" + scale + ",maximum-scale=" + scale);
document.head.appendChild(meta);
setRem();
window.addEventListener("orientationchange", setRem);
window.addEventListener("resize", setRem);

function setRem() {
	var html = document.querySelector('html');
	var width = html.getBoundingClientRect().width;
	html.style.fontSize = width / 16 + "px";
}

window.addEventListener('load', function() {
	document.addEventListener('touchstart', function(e) {
		e.preventDefault();
	});

	setWrapperHeight();
	window.addEventListener("orientationchange", setWrapperHeight);
	window.addEventListener("resize", setWrapperHeight);

	//第一屏ISCROLL图片加载
	delayLoad('', '', 0);

	//第一屏ISCROLL
	(function() {

		var myScroll = new IScroll('.wrapper-one', {
			scrollbars: true,
			fadeScrollbars: true,
		});

		downMenu('favorite-list');

		function downMenu(className) {
			var obj = $$(className);
			for (var i = 0; i < obj.length; i++) {
				obj[i].index = i;
				obj[i].flag = true;
				obj[i].children[0].addEventListener('touchend', function() {
					var icon = this.querySelector('.header-icon');
					var list = this.nextElementSibling || this.nextSibling;
					if (this.parentNode.flag) {
						list.style.display = 'none';
						cssTransform(icon, 'rotate', -90);
						this.parentNode.flag = false;
					} else {
						list.style.display = 'block';
						cssTransform(icon, 'rotate', 0);
						this.parentNode.flag = true;
					}
					myScroll.refresh();
				})
			}
		}
	})();

	//第二屏ISCROLL
	(function() {
		var myScroll = new IScroll('.wrapper-two', {
			scrollbars: true,
			fadeScrollbars: true,
			probeType: 3,
			bounce: false
		});
		myScroll.page = 0;
		myScroll.on('scroll', function() {
			var This = this;
			setTimeout(function() {
				delayLoad(This, '', 0);
			}, 200);
		});
		myScroll.on('scrollEnd', function() {
			var This = this;
			if (this.y <= this.maxScrollY && this.page < 4) {
				this.page++;
				ajax({
					method: 'GET',
					url: 'data/data.json',
					success: onCompletion
				});
			}

			function onCompletion(data) {
				var data = JSON.parse(data).data[0];
				var oSection = createNode('section');
				oSection.className = 'm-recommend';
				var oDiv = createNode('div');
				oDiv.className = 'header';
				var oH2 = createNode('h2');
				oH2.innerHTML = data.title;
				oDiv.appendChild(oH2);
				var oA = createNode('a');
				oA.href = "javascript:;";
				oA.innerHTML = data.more;
				oDiv.appendChild(oA);
				oSection.appendChild(oDiv);
				var oDiv = createNode('div');
				oDiv.className = 'content delay' + 0;
				var oUl = createNode('ul');
				oDiv.appendChild(oUl);
				oSection.appendChild(oDiv);

				for (var i = 0; i < data.list.length; i++) {
					var oLi = createNode('li');
					var oA = createNode('a');
					oA.href = "javascript:;";
					oLi.appendChild(oA);
					var oImg = createNode('img');
					oImg.src = data.src;
					oImg.setAttribute('xsrc', data.list[i].xsrc);
					oA.appendChild(oImg);
					var oP = createNode('p');
					oP.innerHTML = data.list[i].describe;
					oA.appendChild(oP);
					oUl.appendChild(oLi);
				}
				This.scroller.appendChild(oSection);
				setTimeout(function() {
					This.refresh();
				}, 0);
			};
		});
	})();

	//第三屏ISCROLL
	(function() {
		var pullUp = $('pullUp');
		var mContent = $('m-content ul');
		var myScroll = new IScroll('.wrapper-three', {
			scrollbars: true,
			probeType: 2,
		});
		myScroll.page = 0;
		myScroll.on('scroll', function() {
			var This = this;
			setTimeout(function() {
				delayLoad(This, '', 1);
			}, 200);
			if (this.y <= this.maxScrollY) {
				pullUp.style.height = '100px';
				pullUp.style.transition = '1s';
				cssTransform(pullUp, 'scale', 1);
			}
		});
		myScroll.on('scrollEnd', function() {
			var This = this;
			if (this.y <= this.maxScrollY && this.page < 3) {
				this.page++;
				ajax({
					method: 'GET',
					url: 'data/data.json',
					success: onCompletion
				});
			}

			cssTransform(pullUp, 'scale', 0);
			pullUp.style.height = '0';
		
			function onCompletion(data) {
				var data = JSON.parse(data).data[0];
				for (var i = 0; i < data.list.length; i++) {
					var oLi = createNode('li');
					var oA = createNode('a');
					oA.href = "javascript:;";
					oLi.appendChild(oA);
					var oImg = createNode('img');
					oImg.src = data.src;
					oImg.setAttribute('xsrc', data.list[i].xsrc);
					oA.appendChild(oImg);
					var oP = createNode('p');
					oP.innerHTML = data.list[i].describe;
					oA.appendChild(oP);
					mContent.appendChild(oLi);
				}
				setTimeout(function() {
					This.refresh();
				}, 0);
			};
		});
	})();

	//第四屏ISCROLL
	(function() {
		var pullUp = $('pullUp1');
		var mContent = $('m-content2 ul');
		var myScroll = new IScroll('.wrapper-four', {
			scrollbars: true,
			probeType: 2,
		});
		myScroll.page = 0;
		myScroll.on('scroll', function() {
			var This = this;
			if (this.y <= this.maxScrollY) {
				pullUp.style.height = '100px';
				pullUp.style.transition = '1s';
				cssTransform(pullUp, 'scale', 1);
				console.log('scroll');
			}
			setTimeout(function() {
				delayLoad(This, '', 2);
			}, 200);
		});
		myScroll.on('scrollEnd', function() {
			var This = this;
			if (this.y <= this.maxScrollY && this.page < 3) {
				this.page++;
				ajax({
					method: 'GET',
					url: 'data/data.json',
					success: function(data) {
						setTimeout(function() {
							onCompletion(data);
							cssTransform(pullUp, 'scale', 0);
							pullUp.style.height = '0';
						}, 200);
					}
				});
			}

			function onCompletion(data) {
				var data = JSON.parse(data).data[0];
				for (var i = 0; i < data.list.length; i++) {
					var oLi = createNode('li');
					var oA = createNode('a');
					oA.href = "javascript:;";
					oLi.appendChild(oA);
					var oImg = createNode('img');
					oImg.src = data.src;
					oImg.setAttribute('xsrc', data.list[i].xsrc);
					oA.appendChild(oImg);
					var oP = createNode('p');
					oP.innerHTML = data.list[i].describe;
					oA.appendChild(oP);
					mContent.appendChild(oLi);
				}
				setTimeout(function() {
					This.refresh();
				}, 0);
			};
		});
	})();

	//第五屏ISCROLL
	(function() {
		var myScroll = new IScroll('.wrapper-five', {
			scrollbars: true,
			fadeScrollbars: true,
		});
	})();

	//第六屏ISCROLL
	(function() {
		var myScroll = new IScroll('.wrapper-six', {
			scrollbars: true,
			fadeScrollbars: true,
			probeType: 3,
			bounce: false
		});
		loadShare();
		myScroll.page = 1;
		myScroll.on('scrollEnd', function() {
			if (this.y <= this.maxScrollY && this.page < 4) {
				this.page++;
				loadShare();
			}
		});
		
		function loadShare() {
			var shareList = document.getElementById('share-list');
			ajax({
				method: 'GET',
				url: 'data/share.json',
				success: load
			});
			function load(data) {
				var data = JSON.parse(data);
				data = data.data;
				for (var i = 0; i < data.length; i++) {
					var item = createNode('li');
					var portrait = createNode('img');
					portrait.className = 'portrait';
					portrait.src = data[i].portrait;
					append(item, portrait);
					var detail = createNode('div');
					detail.className = 'detail';
					var event = createNode('p');
					event.className = 'event';
					var user = createNode('a');
					user.className = 'user';
					user.innerHTML = data[i].user;
					append(event, user);
					var topic = createNode('p');
					topic.className = 'topic';
					topic.innerHTML = data[i].topic;
					append(event, topic);
					append(detail, event);
					var time = createNode('p');
					time.className = 'time';
					time.innerHTML = data[i].time;
					append(detail, time);
					var comment = createNode('p');
					comment.className = 'comment';
					comment.innerHTML = data[i].comment;
					append(detail, comment);
					var figure = createNode('div');
					figure.className = 'figure';
					for (var j = 0; j < data[i].src.length; j++) {
						var figureItem = createNode('img');
						figureItem.src = data[i].src[j];
						if (data[i].src.length == 4) {
							figureItem.style.width = 360 / 67.5 + 'rem';
							figureItem.style.height = 360 / 67.5 + 'rem';
							figureItem.style.marginRight = 5 / 67.5 + 'rem';
						}
						if (data[i].src.length == 1) {
							figureItem.style.width = 450 / 67.5 + 'rem';
							figureItem.style.height = 450 / 67.5 + 'rem';
						}
						append(figure, figureItem);
					}
					if (data[i].src.length == 4) {
						figure.style.justifyContent = 'flex-start';
						figure.style.webkitjustifyContent = 'flex-start';
					}
					append(detail, figure);
					var song = createNode('div');

					song.className = 'song';
					var cover = createNode('img');
					cover.className = 'cover';
					cover.src = data[i].cover
					append(song, cover);
					var songWrap = createNode('div');
					songWrap.className = 'songWrap';
					var songName = createNode('a');
					songName.className = 'songName';
					songName.innerHTML = data[i].songname;
					append(songWrap, songName);
					var singer = createNode('a');
					singer.className = 'singer';
					singer.innerHTML = data[i].singer;
					append(songWrap, singer);
					append(song, songWrap);
					append(detail, song);

					var list = createNode('div');
					list.className = 'shareWrap';
					var good = createNode('span');
					good.className = 'good';
					good.innerHTML = data[i].good;
					append(list, good);
					var message = createNode('span');
					message.className = 'message';
					message.innerHTML = data[i].message;
					append(list, message);
					var share = createNode('span');
					share.className = 'share';
					share.innerHTML = data[i].share;
					append(list, share);

					var more = createNode('span');
					more.className = 'more';
					append(list, more);

					append(detail, list);
					append(item, detail);
					append(shareList, item)
				}
			}
			setTimeout(function() {
				myScroll.refresh();
			}, 0);
		}
	})();

	//TOP BAR
	(function() {
		var mySwiper = new Swiper('.swiper-container-all', {
			resistanceRatio: 0,
			touchAngle: 30,
			speed: 300,
			initialSlide: 1,
			onSlideChangeStart: function(swiper) {
				var middleItem = $('menu-middle').querySelectorAll('a');
				for (var i = 0; i < middleItem.length; i++) {
					middleItem[i].className = '';
				}
				middleItem[swiper.activeIndex].className = 'active';
			}
		});
		var menuMiddle = $('menu-middle');
		var middleItem = menuMiddle.querySelectorAll('a');
		var menu = $$('menu');

		menuMiddle.addEventListener('touchstart', function(e) {
			var target = e.target;
			
			if (target.nodeName.toLowerCase() == 'a') {
				target.parentNode.style.background =  'rgba(255, 255, 255, 0.05)';
			}
		})
		menuMiddle.addEventListener('touchend', function(e) {
			var target = e.target;
			for (var i = 0; i < middleItem.length; i++) {
				middleItem[i].className = 'restore';
				middleItem[i].index = i;
			}
			if (target.nodeName.toLowerCase() == 'a') {
				target.parentNode.style.background  = '';
				target.className = 'active';
			}
			mySwiper.wrapper[0].style.transition = '.3s';
			mySwiper.setWrapperTranslate(-mySwiper.width * target.index);
			mySwiper.activeIndex = target.index;
		})
		for(var i=0; i<menu.length; i++){
			menu[i].addEventListener('touchstart', function(e) {
				var target = e.target;
				console.log(target.parentNode);
				if (target.nodeName.toLowerCase() == 'a') {
					target.parentNode.style.background = 'rgba(255, 255, 255, 0.05)';
				}
			})
		}
		for(var i=0; i<menu.length; i++){
			menu[i].addEventListener('touchend', function(e) {
				var target = e.target;
				console.log(target.parentNode);
				if (target.nodeName.toLowerCase() == 'a') {
					target.parentNode.style.background = '';
				}
			})
		}
	})();

	// TOP NAV
	(function() {
		var topNav = $('top-nav');
		var topNavItem = document.querySelectorAll('.top-nav li');
		var slideBar = document.querySelector('.top-nav .slide-bar');
		var mySwiper = new Swiper('.swiper-container-home', {
			resistanceRatio: 0,
			touchAngle: 30,
			speed: 250,
			touchReleaseOnEdges: true,
			// nested:true,
			onTouchStart: function(swiper) {
				if (swiper.activeIndex == swiper.slides.length - 1) {
					mySwiper.params.touchMoveStopPropagation = false;

				}
			},
			onTouchMove: function(swiper) {
				if (!mySwiper.touches.diff) {
					return;
				}

				slideBar.style.transition = 'none';
				var translate = cssTransform(slideBar, 'translateX');
				var scale = -swiper.translate / (swiper.width * 4);
				scale = scale < 0 ? 0 : scale;
				scale = scale > 1 ? 1 : scale;
				cssTransform(slideBar, 'translateX', swiper.width * scale);
			},
			onTouchEnd: function(swiper) {
				slideBar.style.transition = '.2s';
				var num = -Math.round(swiper.translate / swiper.width);
				cssTransform(slideBar, 'translateX', slideBar.offsetWidth * num);
				change(num);
			},
			onSlideChangeStart: function(swiper) {
				slideBar.style.transition = '.2s';
				cssTransform(slideBar, 'translateX', slideBar.offsetWidth * swiper.activeIndex);
				change(swiper.activeIndex);

				var scrollLeft = -mySwiper.translate;
				setTimeout(function() {
					delayLoad('', scrollLeft, swiper.activeIndex);
				}, 300);
			}
		})

		function change(num) {
			for (var i = 0; i < topNavItem.length; i++) {
				topNavItem[i].className = '';
			}
			topNavItem[num].className = 'active';
		}

		var num = 0,
			flag = true,
			startX = 0,
			disX = 0;

		topNav.addEventListener(
			'touchstart',
			function(e) {
				flag = true;
				disX = 0;
				startX = e.changedTouches[0].pageX;
				slideBar.style.transition = 'none';
				mySwiper.wrapper[0].style.transition = 'none';
				var target = e.target;
				if (target.nodeName.toLowerCase() == 'li') {
					target.className = 'bg-active';
				}
				num = Math.floor(e.changedTouches[0].pageX / slideBar.offsetWidth);
			}
		);
		topNav.addEventListener(
			'touchmove',
			function(e) {
				var nowX = e.changedTouches[0].pageX;
				disX = Math.abs(nowX - startX);
				for (var i = 0; i < topNavItem.length; i++) {
					topNavItem[i].className = '';
				}
				if (disX >= 5) {
					e.stopPropagation();
					mySwiper.setWrapperTranslate(0);
					flag = false;
				}
				console.log('move:' + flag)
			}
		);
		topNav.addEventListener(
			'touchend',
			function(e) {
				slideBar.style.transition = '.3s';
				mySwiper.wrapper[0].style.transition = '.3s';
				var target = e.target;
				for (var i = 0; i < topNavItem.length; i++) {
					topNavItem[i].className = '';
				}
				if (flag && disX <= 5) {
					if (target.nodeName.toLowerCase() == 'li') {
						target.className = 'active';
					}
					cssTransform(slideBar, 'translateX', slideBar.offsetWidth * num);
					mySwiper.setWrapperTranslate(-mySwiper.width * num);
				}
				setTimeout(function() {
					delayLoad('', scrollLeft, num);
				}, 300);
			}
		);
	})();

	//SIDE SLIDE
	(function() {
		var myScroll = new IScroll('.wrapper-seven', {
			bounce: false,
			probeType: 3,
		});

		var mSetting = $('m-setting');
		$('menu').addEventListener('touchend', function(e) {
			e.stopPropagation();
			mSetting.style.transition = '.2s';
			cssTransform(mSetting, 'translateX', mSetting.offsetWidth);
			show('mask');
		});

		fingerFollow('m-setting', { in : function() {
				var width = mSetting.offsetWidth,
					translateX = cssTransform(mSetting, 'translateX');
				var scale = translateX / width;
				var opacity = scale * .35;
				$('mask').style.opacity = opacity;
			},
			end: function() {
				var width = mSetting.offsetWidth,
					translateX = cssTransform(mSetting, 'translateX');
				var scale = translateX / width;
				var opacity = scale * .35;
				$('mask').style.opacity = opacity;
				if (scale < 0.5) {
					hide('mask');
					myScroll.scrollTo(0, 0);
				}
				$('mask').style.opacity = '.35';
			}
		});
	})();

	//PIC TAB
	(function() {
		var mySwiper = new Swiper('.swiper-container-pic', {
			nested: true,
			autoplay: 2000,
			autoplayDisableOnInteraction: false,
			speed: 600,
			loop: true,
			pagination: '.swiper-pagination',
			touchAngle: 45,
		})
	})();
})

// ISCROLL WRAPPER的高度设置
function setWrapperHeight() {
	var screenHeight = document.querySelector('html').getBoundingClientRect().height;
	var topBarHeight = $('m-top-bar').offsetHeight;
	var topNavHeight = $('top-nav').offsetHeight;
	var mPlayHeight = $('m-play').offsetHeight;
	var wrapper = $$('wrapper');
	var wrapperOne = $('wrapper-one');
	var wrapperSix = $('wrapper-six');
	var wrapperSeven = $('wrapper-seven');
	for (var i = 0; i < wrapper.length; i++) {
		wrapper[i].style.height = screenHeight - topBarHeight - topNavHeight - mPlayHeight + 'px';
	}
	wrapperOne.style.height = screenHeight - topBarHeight - mPlayHeight + 'px';
	wrapperSix.style.height = screenHeight - topBarHeight - mPlayHeight + 'px';
	wrapperSeven.style.height = screenHeight + 'px';
}

//图片延迟加载
function delayLoad(obj, ScrollLeft, page) {
	var aImg = document.querySelectorAll('.delay' + page + ' img');
	var clientHeight = document.body.clientHeight,
		clientWidth = document.body.clientWidth;
	scrollTop = obj ? Math.abs(obj.y) : 0;
	scrollLeft = obj ? Math.abs(obj.x) : 1;
	scrollLeft = ScrollLeft ? ScrollLeft : 1;
	for (var i = 0; i < aImg.length; i++) {
		if (getPos(aImg[i]).top <= scrollTop + clientHeight && scrollLeft) {
			aImg[i].src = aImg[i].getAttribute('xsrc');
		}
	}
}

//跟随手指滑动
function fingerFollow(className, opt) {
	var obj = $(className),
		startX = 0,
		startTranslateX = 0,
		startPoint = null,
		isVertical = false,
		isFirst = true;
	lastTime = 0,
		lastPoint = 0,
		disTance = 0,
		disTime = 0;

	obj.default = { in : function() {},
		end: function() {}
	}
	extend(obj.default, opt);

	obj.addEventListener('touchstart', function(e) {
		start(e);
	})
	obj.addEventListener('touchmove', function(e) {
		move(e);
	})
	obj.addEventListener('touchend', end);

	function start(e) {
		obj.style.transition = 'none';
		startPoint = e.changedTouches[0];
		startTranslateX = cssTransform(obj, 'translateX')
		isVertical = false;
		isFirst = true;

		lastTime = new Date().getTime();
		lastPoint = startPoint.pageX;
		disTance = 0;
		disTime = 0;
	}

	function move(e) {
		if (isVertical) return;
		var nowPoint = e.changedTouches[0];
		var disX = nowPoint.pageX - startPoint.pageX;
		var disY = nowPoint.pageY - startPoint.pageY;
		disX = disX > 0 ? 0 : disX;
		disX = disX < -obj.offsetWidth ? -obj.offsetWidth : disX;
		// console.log(disX, disY);
		if (isFirst) {
			isFirst = false;
			if (Math.abs(disX) < Math.abs(disY)) {
				isVertical = true;
				return;
			}
		} else {
			obj.default.in();
		}
		nowTime = new Date().getTime();
		nowPoint = e.changedTouches[0].pageX;
		disTance = nowPoint - lastPoint;
		lastPoint = nowPoint;
		disTime = nowTime - lastTime;
		lastTime = nowTime;
		cssTransform(obj, 'translateX', disX + startTranslateX);
	}

	function end() {
		translateX = cssTransform(obj, 'translateX');
		obj.style.transition = '.2s';
		if (translateX < obj.offsetWidth / 2) {
			cssTransform(obj, 'translateX', -obj.offsetWidth + startTranslateX);
		} else {
			cssTransform(obj, 'translateX', startTranslateX);
		}
		var speed = disTance / disTime;
		speed = isNaN(speed) ? 0 : speed;
		if (speed < -1.5) {
			cssTransform(obj, 'translateX', -obj.offsetWidth + startTranslateX);
		}
		obj.default.end();
	}
}