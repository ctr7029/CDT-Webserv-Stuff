var SV=window.SV||{};
(function(f,p,q,r){SV.RateTooltipElement=XF.extend(XF.TooltipElement,{__backup:{applyTooltipContent:"svContentRating_applyTooltipContent",reposition:"svContentRating_reposition"},reposition:function(){this.svContentRating_reposition();var a=this.$tooltip.dimensions(!0);if(0!==a.left){var b=this.positioner.dimensions(!0);if(b=a.right-b.right)a=a.left-b,a=Math.max(0,a),this.$tooltip.css({left:a})}},applyTooltipContent:function(){if(!this.svContentRating_applyTooltipContent())return!1;var a=null,b=null,
e=null,k=this.$tooltip.find("."+this.options.baseClass+"-content");k.on("touchmove touchstart",function(c){c=c.originalEvent.targetTouches[0];c=q.elementFromPoint(c.clientX,c.clientY);c=f(c).closest('[data-xf-click="sv-rate"]');if(0<c.length){var d=c.data("xfElementHandlers");if(d&&"tooltip"in d){d=d.tooltip.trigger;var l=c.attr("id");a&&l!==a&&(b.find(".sv-rating-type-icon").removeClass("is-active"),e.hide());d.isShown()||(e=d,a=l,b=c,c.find(".sv-rating-type-icon").addClass("is-active"),d.enter())}}});
k.on("touchend touchcancel",function(c){if("touchend"===c.type&&a){var d=c.originalEvent.changedTouches[0];d=q.elementFromPoint(d.clientX,d.clientY);d=f(d).closest('[data-xf-click="sv-rate"]');0<d.length&&(c.stopPropagation(),c.preventDefault(),d.off("click"),d.trigger("click",c))}k.find('[data-xf-click="sv-rate"]').each(function(l,g){l=f(g);(g=l.data("xfElementHandlers"))&&"tooltip"in g&&(l.find(".sv-rating-type-icon").removeClass("is-active"),g.tooltip.trigger.hide())})});return!0}});SV.RateTooltip=
XF.Element.newHandler({options:{tooltip:null,delay:null,trigger:"hover focus touchclick"},trigger:null,tooltip:null,init:function(){var a=this.getContent();a&&(this.tooltip=new SV.RateTooltipElement(a,{extraClass:"tooltip--sv-rate",html:!0}),null===this.options.delay&&(this.options.delay=XF.config.contentrating.tooltipDelay),this.trigger=new XF.TooltipTrigger(this.$target,this.tooltip,{delayIn:this.options.delay,trigger:this.options.trigger,maintain:!0,onShow:f.proxy(this,"onShow"),onHide:f.proxy(this,
"onHide")}),this.trigger.init())},getContent:function(){var a=this.options.tooltip;if(a&&(a=XF.findRelativeIf(a,this.$target),a.length)){var b=a.clone().contents();a.remove();return b}},onShow:function(){var a=SV.RateTooltip.activeTooltip;a&&a!==this&&a.hide();SV.RateTooltip.activeTooltip=this},onHide:function(){SV.RateTooltip.activeTooltip===this&&(SV.RateTooltip.activeTooltip=null)},show:function(){this.trigger.show()},hide:function(){this.trigger.hide()}});SV.RateTooltip.activeTooltip=null;SV.ReactionTooltipElement=
XF.extend(XF.TooltipElement,{__backup:{reposition:"svContentRating_reposition"},options:f.extend({},XF.TooltipElement.prototype.options,{verticalPositioner:null,horizontalPositioner:null}),reposition:function(){var a=this.positioner;if(!a)console.error("No tooltip positioner");else if(!this.loadRequired){if(a instanceof f){var b;this.options.verticalPositioner&&(b=XF.findRelativeIf(this.options.verticalPositioner,a));b&&b.length||(b=a);b=b.dimensions(!0);var e;this.options.horizontalPositioner&&(e=
XF.findRelativeIf(this.options.horizontalPositioner,a));e&&e.length||(e=a);e=e.dimensions(!0);this.setPositioner({top:b.top,right:e.right,bottom:b.bottom,left:e.left})}this.svContentRating_reposition();this.setPositioner(a)}}});SV.ReactionTooltip=XF.extend(XF.Tooltip,{options:f.extend({},XF.Tooltip.prototype.options,{verticalPositioner:null,horizontalPositioner:null}),init:function(){var a=this.getContent(),b=XF.TooltipOptions.extractTooltip(this.options);b.verticalPositioner=this.options.verticalPositioner;
b.horizontalPositioner=this.options.horizontalPositioner;this.tooltip=new SV.ReactionTooltipElement(a,b);a=XF.TooltipOptions.extractTrigger(this.options);this.trigger=new XF.TooltipTrigger(this.$target,this.tooltip,a);this.trigger.init()}});SV.RateClick=XF.Click.newHandler({eventNameSpace:"SVRateClick",options:{ratingBar:null,ratingMenu:null,nativeReactionsBar:null},tooltipTarget:null,init:function(){},click:function(a){a.preventDefault();if(a=SV.RateTooltip.activeTooltip){this.tooltipTarget=a.$target;
if(this.$target.xfUniqueId()===a.$target.xfUniqueId())return;a.hide()}a=this.$target.closest(".menu");a.length&&a.trigger("menu:close");a=this.$target.attr("href");XF.ajax("POST",a,{},f.proxy(this,"handleAjax"),{skipDefaultSuccess:!0})},handleAjax:function(a){var b=this.$target;this.tooltipTarget&&this.tooltipTarget.length&&(b=this.tooltipTarget);var e=this.options.nativeReactionsBar?this.options.nativeReactionsBar:b.data().nativeReactionsBar,k=e?XF.findRelativeIf(e,b):f([]),c=this.options.ratingBar,
d=c?XF.findRelativeIf(c,b):f([]),l=this.options.ratingMenu,g=l?XF.findRelativeIf(l,b):f([]),m=XF.config.contentrating.menuDelay;k.length?("ratingBarMenu"in a&&"content"in a.ratingBarMenu&&a.ratingBarMenu.content&&XF.setupHtmlInsert(a.ratingBarMenu,function(h){g.length&&a.ratingBarMenu.content&&(h.hide(),h.insertAfter(g),e&&h.find('[data-xf-click="sv-rate"]').data("nativeReactionsBar",e),g.fadeOut(m,function(){g.remove();h.fadeIn(m)}))}),"undefined"!==typeof a.html&&k.length&&(a.html.content.trim()?
XF.setupHtmlInsert(a.html,function(h,n){k.html(h).addClassTransitioned("is-active");e&&k.find('[data-xf-click="sv-rate"]').data("nativeReactionsBar",e)}):k.removeClassTransitioned("is-active",function(){k.empty()}))):"undefined"!==typeof a.html&&d.length&&XF.setupHtmlInsert(a.html,function(h){if(g.length){var n=h.find(l).detach();n.hide();n.insertAfter(g)}h.hide();h.insertAfter(d);d.fadeOut(m,function(){d.remove();h.fadeIn(m)});g.length&&g.fadeOut(m,function(){g.remove();n.fadeIn(m);XF.activate(n)})})}});
SV.TouchDetect=XF.Element.newHandler({init:function(){SV.TouchDetectEnabled||(SV.TouchDetectEnabled=!0,f("html").one("touchstart",function(){f("html").addClass("sv-touch-enabled")}))}});SV.RatingCategoryCollapsible=XF.Element.newHandler({options:{location:null},storage:null,$hideLink:null,$showLink:null,$list:null,init:function(){this.options.location?(this.$hideLink=this.$target.find(".hide"),this.$showLink=this.$target.find(".show"),this.storage=p.localStorage,"undefined"===typeof this.storage&&
(this.storage=p.sessionStorage,"undefined"===typeof this.storage&&(this.storage={getItem:function(){},setItem:function(){},removeItem:function(){}})),this.$list=this.getList(),this.$target.click(f.proxy(this,"onShowControlsClick")),this.initListHiding()):console.log("Require a storage location to be set")},getList:function(){return this.$target.closest(".dataList-row--subSection").nextUntil(".dataList-row--subSection")},initListHiding:function(){this.storage.getItem(location)?(this.$hideLink.removeClass("active"),
this.$showLink.addClass("active"),this.$list.hide()):(this.$hideLink.addClass("active"),this.$showLink.removeClass("active"))},onShowControlsClick:function(){this.storage.getItem(location)?(this.storage.removeItem(location),this.$hideLink.addClass("active"),this.$showLink.removeClass("active")):(this.storage.setItem(location,"1"),this.$hideLink.removeClass("active"),this.$showLink.addClass("active"));this.$list.slideToggle("fast")}});SV.TouchDetectEnabled=!1;XF.Element.register("sv-touch-detect",
"SV.TouchDetect");XF.Element.register("sv-rate-tooltip","SV.RateTooltip");XF.Element.register("sv-rating-type-tooltip","SV.ReactionTooltip");XF.Element.register("sv-rating-category-collapsible","SV.RatingCategoryCollapsible");XF.Click.register("sv-rate","SV.RateClick")})(jQuery,window,document);