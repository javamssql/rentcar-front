/**
 * Front UI Script
 *
 */

const frontJS = {
	CLASSNAME: {
		ACTIVE: "active",
		PREVENT: "prevent"
	},

	/**
	 * Tab
	 *
	 * @param elem {Object} 탭 클릭 객체
	 */
	tab: function(elem) {
		const {tabBtn, tabIdx} = elem.dataset;

		$(`[data-tab-btn='${tabBtn}']`).removeClass(frontJS.CLASSNAME.ACTIVE);
		$(elem).addClass(frontJS.CLASSNAME.ACTIVE);
		$(`[data-tab-cont='${tabBtn}']`).removeClass(frontJS.CLASSNAME.ACTIVE);
		$(`[data-tab-cont='${tabBtn}'][data-tab-idx='${tabIdx}']`).addClass(frontJS.CLASSNAME.ACTIVE);
	},

	/**
	 * Switch
	 *
	 * @param elem {Object} 스위치 클릭 객체
	 */
	switch: function(elem) {
		const {switchInp, switchOn, switchOff} = elem.dataset;
		const elemText = $(`[data-switch-text="${switchInp}"]`);

		$(elem).prop("checked") ? elemText.text(switchOn) : elemText.text(switchOff);
	},

	/**
	 * Faq
	 *
	 * @desc Faq 슬라이드 토글
	 * @param elem {Object} Faq 클릭 객체
	 */
	faq: function(elem) {
		const elemItem = $(elem).closest("[data-faq]");

		$(elem).toggleClass(frontJS.CLASSNAME.ACTIVE);
		elemItem.find("[data-faq-cont]").stop().slideToggle().toggleClass(frontJS.CLASSNAME.ACTIVE);
	},

	/**
	 * Select
	 *
	 * @desc 디자인 가능한 셀렉트 박스
	 * @param elem {Object} select 클릭 객체
	 */
	select: function(elem) {

		return {
			// 셀렉트 목록 토글
			toggle: function() {
				const {selectBtn} = elem.dataset;

				$(elem).toggleClass(frontJS.CLASSNAME.ACTIVE);
				$(`[data-select-list="${selectBtn}"]`).toggleClass(frontJS.CLASSNAME.ACTIVE);
			},

			// 셀렉트 옵션 선택
			option: function() {
				const elemList = $(elem).closest("[data-select-list]");
				const idx = elemList.attr("data-select-list");
				const elemBtn = $(`[data-select-btn="${idx}"]`);

				elemBtn.removeClass(frontJS.CLASSNAME.ACTIVE);
				elemList.removeClass(frontJS.CLASSNAME.ACTIVE);
				elemBtn.attr("data-select-idx", $(elem).attr("data-select-option"));
				elemBtn.text($(elem).text());
			}
		}
	},

	/**
	 * Modal
	 *
	 * @desc 모달 팝업
	 * @param idx {String} 오픈할 팝업 고유 idx
	 */
	modal: function (idx) {
		const elemModal = $(`[data-modal="${idx}"]`);
		const elemBody = $("body");

		return {
			// 팝업 열기
			show: function () {
				elemModal[0].showModal();
				elemModal.addClass(frontJS.CLASSNAME.ACTIVE);
				elemBody.addClass(frontJS.CLASSNAME.PREVENT);

				// backdrop click -> modal hide
				$(elemModal).on("click", function (e) {
					if($(e.target).closest(".modal-box").length <= 0) {
						frontJS.modal(idx).hide();
					}
				});

				// sheet type: touch event
				if (elemModal.hasClass("modal-sheet")) {
					let startY = 0;
					let startScrollTop = 0;
					let isScrolling = false;
					const box = elemModal.find(".modal-box")[0];

					box.addEventListener("touchstart", function (e) {
						startY = e.touches[0].clientY;
						startScrollTop = box.scrollTop;
						isScrolling = false;
					}, { passive: true });

					box.addEventListener("touchmove", function (e) {
						const deltaY = e.touches[0].clientY - startY;

						if (startScrollTop > 0 || deltaY < 0) {
							isScrolling = true;
						}
					}, { passive: true });

					box.addEventListener("touchend", function (e) {
						const deltaY = e.changedTouches[0].clientY - startY;

						if (isScrolling || startScrollTop > 0) return;

						if (deltaY > 60) {
							frontJS.modal(idx).hide();
						}
					}, { passive: true });
            }
			},

			// 팝업 닫기
			hide:function () {
				elemModal[0].close();
				elemModal.removeClass(frontJS.CLASSNAME.ACTIVE);

				if(!$("[data-modal]").hasClass(frontJS.CLASSNAME.ACTIVE))
					elemBody.removeClass(frontJS.CLASSNAME.PREVENT);
			}
		}
	},

	/**
	 * Count
	 *
	 * @desc 숫자 카운트
	 * @param elem {Object} 증가 또는 감소 클릭 객체
	 */
	count: function (elem) {
		const {countIdx, countMin, countMax} = elem.dataset;
		const elemCount = $(`[data-count-idx="${countIdx}"][data-count-value]`);
		let num = Number(elemCount.attr("data-count-value"));

		return {
			// 숫자 증가
			plus: function () {
				if(countMax && countMax > num) {
					num++;
					elemCount.attr("data-count-value", num).text(num);
				}
			},

			// 숫자 감소
			minus: function () {
				num <= countMin ? num = countMin : num--;
				elemCount.attr("data-count-value", num).text(num);
			}
		}
	},

	/**
	 * Alert
	 *
	 * @desc 디자인 가능한 알림창
	 */
	alert: function () {

		return {
			/**
			 * @desc 알림창 html 생성(내부 함수)
			 * @param text {String} 알림창 텍스트(html)
			 * @param type {String|Null} 취소 버튼 생성 여부 (값이 있으면 취소 생성)
			 */
			draw: function (text, type) {
				let html = ``;
				html += `<dialog class="alert" data-modal="alert" data-alert="alert">`;
				html += `   <div class="alert-box">`;
				html += `      <div class="alert-text">${text}</div>`;
				html += `      <div class="alert-btn-box">`;
				if(type) {
					html += `         <button type="button" class="button button-line-black" data-alert="cancel">취소</button>`;
				}
				html += `         <button type="button" class="button button-color-primary" data-alert="confirm">확인</button>`;
				html += `      </div>`;
				html += `   </div>`;
				html += `</dialog>`;

				return html;
			},

			/**
			 * @desc 알림창 생성(확인)
			 * @param text {String} 알림창 텍스트(html)
			 * @param callbackConfirm {Function|Null} 확인 클릭 콜백 함수
			 */
			alert: function (text, callbackConfirm) {
				$("body").append(frontJS.alert().draw(text));
				frontJS.modal("alert").show();

				const elemConfirm = $(`[data-alert="confirm"]`);

				if(callbackConfirm) {
					elemConfirm.bind("click", callbackConfirm);
				} else {
					elemConfirm.bind("click", frontJS.alert().hide);
				}
			},

			/**
			 * @desc 알림창 생성(확인, 취소)
			 * @param text {String} 알림창 텍스트(html)
			 * @param callbackConfirm {Function|Null} 확인 클릭 콜백 함수
			 * @param callbackCancel {Function|Null} 취소 클릭 콜백 함수
			 */
			confirm: function (text, callbackConfirm, callbackCancel) {
				$("body").append(frontJS.alert().draw(text, "confirm"));
				frontJS.modal("alert").show();

				const elemConfirm = $(`[data-alert="confirm"]`);
				const elemCancel = $(`[data-alert="cancel"]`);

				if(callbackConfirm) {
					elemConfirm.bind("click", callbackConfirm);
				} else {
					elemConfirm.bind("click", frontJS.alert().hide);
				}

				if(callbackCancel)
					elemCancel.bind("click", callbackCancel);
				else {
					elemCancel.bind("click", frontJS.alert().hide);
				}
			},

			// 알림창 닫기(내부 함수)
			hide: function () {
				frontJS.modal("alert").hide();
				$(`[data-alert="alert"]`).remove();
			}
		}
	},

	/**
	 * Mediaquery check
	 *
	 * @desc 현재 디바이스를 미디어쿼리 기준으로 분기
	 * @return viewport : M(Mobile) / T(Tablet) / P(Pc)
	 */
	mediaCheck: function () {
		const pc = window.matchMedia("screen and (max-width: 1023px)");
		const tablet = window.matchMedia("screen and (max-width: 767px)");
		let viewport = "M";

		if(!pc.matches) {
			viewport = "P";
		} else if(pc.matches && !tablet.matches) {
			viewport = "T";
		}

		return viewport;
	},

	/**
	 * Rating
	 *
	 * @desc 별점 평가
	 * @param elem {String} input range 객체
	 */
	rating: function (elem) {
		const elemStar = $(elem).siblings(`[data-rating="fill"]`);
		const max = Number($(elem).attr("max"));

		elemStar.css("width", `${$(elem).val() * (100 / max)}%`);
	},

	/**
	 * Toggle
	 *
	 * @param elem {Object} toggle 클릭 객체
	 * @param idx {String} toggle 객체 고유 idx
	 */
	toggle: function(elem, idx) {
		const elemObj = $(`[data-toggle="${idx}"]`);

		return {
			toggle: function () {
				$(elem).toggleClass(frontJS.CLASSNAME.ACTIVE);
				elemObj.toggleClass(frontJS.CLASSNAME.ACTIVE);
			},

			show: function () {
				$(elem).addClass(frontJS.CLASSNAME.ACTIVE);
				elemObj.addClass(frontJS.CLASSNAME.ACTIVE);
			},

			hide: function () {
				$(elem).removeClass(frontJS.CLASSNAME.ACTIVE);
				elemObj.removeClass(frontJS.CLASSNAME.ACTIVE);
			}
		}
	},

	/**
	 * Observer
	 *
	 * @desc 특정 객체 관찰 후 이벤트 발생
	 * @param elem {Object} 관찰할 객체
	 * @param option {Object|Null} 관찰 옵션 설정
	 * @param callback {Function|Null} 관찰 콜백 함수
	 * @param callbackHide {Function|Null} 보이지 않을 경우 콜백 함수
	 */
	observer: function (elem, option, callback, callbackHide) {
		const opt = option ? option : {threshold: 0};
		const observer = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				// 객체가 보일 경우
				if(entry.intersectionRatio > 0) {
					if(callback)
						callback();
				} else {
					if(callbackHide)
						callbackHide();
				}
			});
		}, opt);

		observer.observe(elem[0]);
	},

	/**
	 * Datepicker
	 *
	 */
	datepicker: function () {
		$(`[data-picker]`).datepicker({
			dateFormat: "yy-mm-dd",
			showOtherMonths: false, // 현재 달력에서 이전달, 다음달 노출 여부
			selectOtherMonths: false, // 현재 달력에서 이전달, 다음달 선택 여부
			changeMonth: true, // 콤보 박스에서 월 선택 가능
			changeYear: true, // 콤보 박스에서 연 선택 가능
			showButtonPanel: true, // 하단 버튼 노출 여부
			minDate: "-20D", // 최소 선택일자
			maxDate: "+2M +20D", // 최대 선택일자
			closeText: "닫기", // 한글로 설정(아래 목록 포함)
			prevText: "이전달",
			nextText: "다음달",
			currentText: "오늘",
			monthNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			monthNamesShort: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
			dayNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
			dayNamesShort: ["일", "월", "화", "수", "목", "금", "토"],
			dayNamesMin: ["일", "월", "화", "수", "목", "금", "토"],
			weekHeader: "Wk",
			yearSuffix: "", // 년
			firstDay: 0,
			isRTL: !1,
			showMonthAfterYear: !0,
		});
	},

	/**
	 * AOS
	 *
	 */
	aos: function () {
		if($(`[data-aos]`).length > 0) {
			AOS.init({duration: 1000});
		}
	}
}



/**
 * Main
 *
 */
const main = {
	init: function () {
		main.visual();
		main.live();
		main.curation();
		main.banner();
		main.tv();
		main.review();
		main.popup();
	},

	visual: function () {
		const elemStr = `[data-slide="main-visual-card"]`;
		const REAL_COUNT = document.querySelectorAll(`${elemStr} .swiper-slide`).length;
		const COPIES = 4;
		const JUMP_AT = REAL_COUNT * (COPIES - 1);
		const CIRCUMFERENCE = 2 * Math.PI * 11; // r=11 → ≈ 69.12

		const progressCircle = document.querySelector(`${elemStr} #progressCircle`);
		const fracCurrent    = document.querySelector(`${elemStr} #fracCurrent`);
		const fracTotal      = document.querySelector(`${elemStr} #fracTotal`);

		function pad(n) {
			return String(n).padStart(2, '0');
		}

		function updatePagination(index) {
			const current = (index % REAL_COUNT) + 1;
			progressCircle.style.strokeDashoffset = CIRCUMFERENCE * (1 - current / REAL_COUNT);
			fracCurrent.textContent = pad(current);
			fracTotal.textContent   = pad(REAL_COUNT);
		}

		const swiper = new Swiper(elemStr, {
			effect: "cards",
			grabCursor: true,
			speed: 500,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			cardsEffect: {
				rotate: true,
				perSlideRotate: 20,
				perSlideOffset: 40,
			},
			on: {
				init(sw) {
					const wrapper = sw.wrapperEl;
					const originals = [...wrapper.children];
					for (let i = 1; i < COPIES; i++) {
						originals.forEach(slide => wrapper.appendChild(slide.cloneNode(true)));
					}
					sw.update();
					updatePagination(sw.activeIndex);
				},
				slideChange(sw) {
					if (sw.activeIndex >= JUMP_AT) {
						sw.slideTo(sw.activeIndex % REAL_COUNT, 0);
					}
					updatePagination(sw.activeIndex);
				},
			},
		});
	},

	live: function () {
		const elemStr = `[data-slide="main-live"]`;
		const swiper = new Swiper(`${elemStr} .swiper`, {
			slidesPerView: 1.6,
			spaceBetween: 10,
			speed: 800,
			autoplay: {
				delay: 2500,
				disableOnInteraction: false
			},
			pagination: {
				el: `${elemStr} .swiper-pagination`,
				type: "progressbar",
			},
			navigation: {
				nextEl: `${elemStr} .swiper-button-next`,
				prevEl: `${elemStr} .swiper-button-prev`,
			},
			breakpoints: {
				768: {
					slidesPerView: 1.8,
					spaceBetween: 20,
				},
				1024: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1440: {
					slidesPerView: 3,
					spaceBetween: 40,
				},
			},
		});

		const counter = new CountUp('counter', 20763, {
			duration: 2,
			separator: ',',
			onCompleteCallback: function () {
				$(".main-live-counter .counter").addClass(frontJS.CLASSNAME.ACTIVE);
			}
		});

		frontJS.observer($(elemStr), { threshold: 0.3 }, function() {
			counter.start();
		});
	},

	curation: function () {
		const elemStr = `[data-slide="main-curation"]`;

		function updateBorderClass(swiper) {
			swiper.slides.forEach(function(slide) {
				const index = parseInt($(slide).attr("data-swiper-slide-index"));
				const borderClass = index % 2 === 0 ? "border-odd" : "border-even";

				$(slide).removeClass("border-odd border-even").addClass(borderClass);
			});
		}

		const swiper = new Swiper(elemStr, {
			slidesPerView: 1.4,
			spaceBetween: 20,
			centeredSlides: true,
			loop: true,
			speed: 1000,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			breakpoints: {
				768: {
					slidesPerView: 2.4,
					spaceBetween: 20,
					centeredSlides: true,
				},
				1024: {
					slidesPerView: 3,
					spaceBetween: 20,
					centeredSlides: false,
				},
				1440: {
					slidesPerView: 4,
					spaceBetween: 40,
					centeredSlides: false,
				},
			},
			on: {
				init: function() {
					updateBorderClass(this);
				},
				slideChangeTransitionStart: function() {
					updateBorderClass(this);
				},
			}
		});
	},

	banner: function () {
		const elemStr = `[data-slide="main-banner"]`;
		const swiper = new Swiper(elemStr, {
			slidesPerView: 1,
			spaceBetween: 20,
			loop: true,
			speed: 800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			pagination: {
				el: `${elemStr} .swiper-pagination`,
				type: "fraction",
			},
			breakpoints: {
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				1440: {
					slidesPerView: 2,
					spaceBetween: 40,
				},
			},
		});
	},

	tv: function () {
		const elemStr = `[data-slide="main-tv"]`;
		const elemPause = $(`${elemStr} .swiper-button-pause`);
		const elemPlay  = $(`${elemStr} .swiper-button-play`);
		const elemClose = $(".modal-tv .modal-close");

		const REAL_COUNT = document.querySelectorAll(`${elemStr} .swiper-slide`).length;
		const COPIES     = 4;
		const JUMP_FWD   = REAL_COUNT * (COPIES - 1);
		const JUMP_BWD   = REAL_COUNT - 1;

		// pagination
		const paginationEl = document.querySelector(`${elemStr} .swiper-pagination`);
		function updatePagination(index) {
			const current = (index % REAL_COUNT) + 1;
			paginationEl.textContent = `${current} / ${REAL_COUNT}`;
		}

		const swiper = new Swiper(`${elemStr} .swiper`, {
			effect: "cards",
			grabCursor: true,
			cardsEffect: {
				rotate: true,
				perSlideRotate: 0,
				perSlideOffset: 10,
			},
			autoplay: {
				delay: 3000,
				disableOnInteraction: false,
			},
			navigation: {
				nextEl: `${elemStr} .swiper-button-next`,
				prevEl: `${elemStr} .swiper-button-prev`,
			},
			on: {
				init(sw) {
					const wrapper   = sw.wrapperEl;
					const originals = [...wrapper.children];
					for (let i = 1; i < COPIES; i++) {
						originals.forEach(slide => wrapper.appendChild(slide.cloneNode(true)));
					}
					sw.update();
					sw.slideTo(REAL_COUNT, 0);
					updatePagination(REAL_COUNT);
				},
				slideChange(sw) {
					const idx = sw.activeIndex;

					if (idx >= JUMP_FWD) {
						sw.slideTo(idx % REAL_COUNT, 0);
						return;
					}
					if (idx <= JUMP_BWD - 1) {
						sw.slideTo(idx + REAL_COUNT * 2, 0);
						return;
					}
					updatePagination(idx);
				},
			},
		});

		elemPause.on("click", function () {
			elemPlay.addClass(frontJS.CLASSNAME.ACTIVE);
			elemPause.removeClass(frontJS.CLASSNAME.ACTIVE);
			swiper.autoplay.stop();
		});

		elemPlay.on("click", function () {
			elemPlay.removeClass(frontJS.CLASSNAME.ACTIVE);
			elemPause.addClass(frontJS.CLASSNAME.ACTIVE);
			swiper.autoplay.start();
		});

		$(document).on("click", `${elemStr} .swiper-slide`, function (e) {
			e.preventDefault();
			frontJS.modal("tv").show();
			swiper.autoplay.stop();
			elemPlay.addClass(frontJS.CLASSNAME.ACTIVE);
			elemPause.removeClass(frontJS.CLASSNAME.ACTIVE);
		});

		elemClose.on("click", function () {
			swiper.autoplay.start();
			elemPlay.removeClass(frontJS.CLASSNAME.ACTIVE);
			elemPause.addClass(frontJS.CLASSNAME.ACTIVE);
		});
	},

	review: function () {
		const elemStr = `[data-slide="main-review"]`;
		const elemClose = $(".modal-review .modal-close");

		const swiper = new Swiper(elemStr, {
			slidesPerView: 1.25,
			spaceBetween: 20,
			loop: true,
			speed: 800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			breakpoints: {
				768: {
					slidesPerView: 2.5,
					spaceBetween: 20,
				},
				1024: {
					slidesPerView: 4,
					spaceBetween: 20,
				},
				1440: {
					slidesPerView: 4,
					spaceBetween: 30,
				},
			},
		});

		const elemPopup = `[data-slide="main-review-popup"]`;
		const popupSwiper = new Swiper(`${elemPopup}`, {
			slidesPerView: 1,
			loop: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: false
			},
			pagination: {
				el: `${elemPopup} .swiper-pagination`,
				type: "fraction",
			},
		});

		$(document).on("click", `${elemStr} .swiper-slide`, function(e) {
			e.preventDefault();
			frontJS.modal("review").show();
			swiper.autoplay.stop();
		});

		elemClose.on("click", function() {
			swiper.autoplay.start();
		});
	},

	popup: function () {
		const elemStr = `[data-slide="pop-up"]`;
		const swiper = new Swiper(elemStr, {
			slidesPerView: 1,
			loop: true,
			speed: 500,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			pagination: {
				el: `${elemStr} .swiper-pagination`,
				type: "fraction",
				renderFraction: function (currentClass, totalClass) {
					return `<span class="${currentClass}"></span> · <span class="${totalClass}"></span>`;
				},
			},
			navigation: {
				nextEl: `${elemStr} .swiper-button-next`,
				prevEl: `${elemStr} .swiper-button-prev`,
			},
		});
	},
}


/**
 * layout
 *
 **/
const layout = {

	gnb: function() {
		const elemItem = $(".ui-gnb-item");
		const elemGnb = $(".ui-gnb");
		const elemOpen = $(".ui-gnb-open");
		const elemClose = $(".ui-gnb-close");
		const elemHeader = $(".header");

		// PC
		if(frontJS.mediaCheck() === "P") {
			elemItem.on("mouseenter", function() {
				$(this).addClass(frontJS.CLASSNAME.ACTIVE);
			});

			elemItem.on("mouseleave", function() {
				elemItem.removeClass(frontJS.CLASSNAME.ACTIVE);
			});
		}

		// TABLET & MOBILE
		else {
			elemOpen.on("click", function() {
				elemGnb.addClass(frontJS.CLASSNAME.ACTIVE);
				$("body").addClass(frontJS.CLASSNAME.PREVENT);
			});
	
			elemClose.on("click", function() {
				elemGnb.removeClass(frontJS.CLASSNAME.ACTIVE);
				$("body").removeClass(frontJS.CLASSNAME.PREVENT);
			});

			$(window).on("scroll.gnb", function() {
				if ($(this).scrollTop() > 0) {
					elemHeader.addClass(frontJS.CLASSNAME.ACTIVE);
				} else {
					elemHeader.removeClass(frontJS.CLASSNAME.ACTIVE);
				}
			});
		}
	},

	search: function() {
		const elemSearch = $(".ui-header-search");
		const elemBtn = $(".ui-search");
		const selector = ".ui-header-search, .ui-search";

		elemBtn.on("click", function() {
			elemSearch.toggleClass(frontJS.CLASSNAME.ACTIVE);
		});

		$(document).on("click", function(e) {
			if (!$(e.target).closest(selector).length) {
				elemSearch.removeClass(frontJS.CLASSNAME.ACTIVE);
			}
		});
	},

	top: function() {
		$("body, html").stop().animate({scrollTop : 0}, 400);
	},

	addr: function () {
		const elemBtn  = $('.ui-addr-btn');
		const elemAddr = $('.ui-addr-box');

		elemBtn.on('click', function () {
			$(this).toggleClass(frontJS.CLASSNAME.ACTIVE);
			elemAddr.stop(true).slideToggle(300);
		});
	},

	quick: function() {
		const elemBtn = $(".quick-menu .top-btn");
		let lastScrollTop = 0;

		$(window).on("scroll.quickMenu", function() {
			const currentScrollTop = $(this).scrollTop();

			if (currentScrollTop > lastScrollTop) {
				elemBtn.addClass(frontJS.CLASSNAME.ACTIVE);
			} else {
				elemBtn.removeClass(frontJS.CLASSNAME.ACTIVE);
			}

			lastScrollTop = currentScrollTop;
		});
	},

}


/**
 * contents
 *
 */
const contents = {

	ranking: function () {
		const elemStr = `[data-slide="ranking-slide"]`;

		let swiperActive;

		const swiperThumbs = new Swiper(`${elemStr} .ranking-slide-thumbs`, {
			slidesPerView: 2.4,
			spaceBetween: 36,
			loop: true,
			speed: 500,
			slideToClickedSlide: true,
			allowTouchMove: true,
			on: {
				activeIndexChange() {
					if (swiperActive && swiperActive.realIndex !== this.realIndex) {
						swiperActive.slideToLoop(this.realIndex);
					}
				},
			},
		});

		swiperActive = new Swiper(`${elemStr} .ranking-slide-active`, {
			slidesPerView: 3,
			spaceBetween: 10,
			loop: true,
			speed: 500,
			preventInteractionOnTransition: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: false
			},
			navigation: {
				nextEl: `${elemStr} .swiper-button-next`,
				prevEl: `${elemStr} .swiper-button-prev`,
			},
			on: {
				activeIndexChange() {
					if (swiperThumbs && swiperThumbs.realIndex !== this.realIndex) {
						swiperThumbs.slideToLoop(this.realIndex);
					}
				},
			},
			breakpoints: {
				768: {
					slidesPerView: 1.001,
				},
			},
		});
	},

	promotion: function () {
		const elemStr = `[data-slide="promotion-slide"]`;
		const swiper = new Swiper(elemStr, {
			slidesPerView: 1,
			spaceBetween: 20,
			loop: true,
			speed: 500,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			pagination: {
				el: `${elemStr} .swiper-pagination`,
				type: "fraction",
			},
		});
	},

	capital: function () {
		const self = this;

		const getSelected = function (name) {
			return Number($(`input[name="${name}"]:checked`).val());
		};

		const getPrice = function () {
			const period  = getSelected('period');
			const deposit = getSelected('deposit');
			const distance = getSelected('distance');
			return priceTable[period]?.[deposit]?.[distance] ?? null;
		};

		const counter = new CountUp('capitalPrice', getPrice(), {
			duration: 0.6,
			separator: ',',
		});
		counter.start();

		$('input[name="period"], input[name="deposit"], input[name="distance"]').on('change', function () {
			const newPrice = getPrice();
			if (newPrice) counter.update(newPrice);
		});
	},

	review: function () {
		const elemStr = `[data-slide="review-slide"]`;
		const elemClose = $(".modal-review .modal-close");

		const swiper = new Swiper(elemStr, {
			slidesPerView: 1.6,
			spaceBetween: 20,
			loop: true,
			speed: 800,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			breakpoints: {
				1440: {
					slidesPerView: 2.6,
					spaceBetween: 20,
				},
			},
		});

		const elemPopup = `[data-slide="review-popup"]`;
		const popupSwiper = new Swiper(`${elemPopup}`, {
			slidesPerView: 1,
			loop: true,
			autoplay: {
				delay: 5000,
				disableOnInteraction: false
			},
			pagination: {
				el: `${elemPopup} .swiper-pagination`,
				type: "fraction",
			},
		});

		$(document).on("click", `${elemStr} .swiper-slide`, function(e) {
			e.preventDefault();
			frontJS.modal("review").show();
			swiper.autoplay.stop();
		});

		elemClose.on("click", function() {
			swiper.autoplay.start();
		});
	},

	color: function () {
		const elemColor  = $('.ui-color');

		elemColor.on('click', function () {
			const elemChip = $(this).closest('.color-chip');
			const elemBox  = $(this).closest('.color-box');

			elemChip.find('.color').removeClass(frontJS.CLASSNAME.ACTIVE);
			$(this).addClass(frontJS.CLASSNAME.ACTIVE);

			elemBox.find('.color-label').text($(this).data('label'));
		});
	},

}


/**
 * mypage
 *
 **/
const mypage = {

	compare: function () {
		const elemStr = `[data-slide="compare-slide"]`;
		const swiper = new Swiper(elemStr, {
			slidesPerView: 1.3,
			spaceBetween: 15,
			speed: 500,
			pagination: {
				el: `${elemStr} .swiper-pagination`,
			},
			breakpoints: {
				768: {
					slidesPerView: 1,
					spaceBetween: 15,
				},
				1024: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				1440: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			},
		});
	},

	garage: function () {
		const elemStr = `[data-slide="garage-slide"]`;
		const swiper = new Swiper(elemStr, {
			slidesPerView: 1,
			spaceBetween: 15,
			speed: 500,
			pagination: {
				el: `${elemStr} .swiper-pagination`,
			},
			breakpoints: {
				768: {
					slidesPerView: 1.2,
					spaceBetween: 15,
				},
				1024: {
					slidesPerView: 1.8,
					spaceBetween: 20,
				},
				1440: {
					slidesPerView: 2.5,
					spaceBetween: 30,
				},
			},
		});
	},

	promotion: function () {
		const elemStr = `[data-slide="promotion-slide"]`;
		const swiper = new Swiper(elemStr, {
			slidesPerView: 1,
			spaceBetween: 20,
			loop: true,
			speed: 500,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			pagination: {
				el: `${elemStr} .swiper-pagination`,
				type: "fraction",
			},
			breakpoints: {
				1024: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
			},
		});
	},

}