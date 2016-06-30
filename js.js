/*liuflwy@163.com
* 2016-06-30
*/
(function ($, window) {

  var TPL_DIALOG =
        '<div id="dilog-id-1" class="dialog-wrap" data-role="dialog-wrap" style="display:none;">' +
        '  <div style="display:none;" class="dialog-title" data-role="dialog-title-wrap">' +
        '    <h3 data-role="dialog-title"></h3>' +
        '  </div>' +
        '  <div class="dialog-content" data-role="dialog-content"></div>' +
        '  <a href="#" style="display:none;" class="dialog-close" title="关闭" data-role="dialog-close"><i class="icoClose">X</i></a>' +
        '</div>';

  var Dialog = function Dialog() {  };//this._initialize.applay(this, arguments);
  var config = {
			id:'',
			useMask: true,
			useTitle: true, 	// 使用标题
			maskClose: false, 	// 是否点击mask关闭dialog
			useClose: true, //是否启用关闭按钮
			center: true, 		// 该项与top,left配置项互斥
			fixed: true, 		// 默认不随滚动移动
			top: 0,
			left: 0,
			width: 300,
			height: 'auto',
			dialogClass: '',
			deleteClass: 'dialog-close',
			title: '标题',
			zIndex:10000,
			container: TPL_DIALOG,
			content:null
      	};


  Dialog.prototype = {
  	catchAll:[], //{'dialog':dialog, 'mask':mask,}
  	dialogIndex:0,
  	show: function ( opt ) {
  		this._initialize( opt );

  		this._addEvent();

  		this.open();
  	},

  	open: function () {
  		var apps  = this._getCurDialog(),
  			$dialog = apps.dialog,
  			$mask = apps.mask;

  		$('body').append( $dialog ).append( $mask );
  		$dialog.fadeIn('slow','linear');
  	},

  	close: function () {
  		var apps  = this._getCurDialog(),
  			$dialog = apps.dialog,
  			$mask = apps.mask;
  		$dialog.fadeOut('slow','linear');
  		$mask.hide();
  		this._destroy( $dialog, $mask );
  		this.catchAll.unshift();
  		--this.dialogIndex;
  	},

  	_initialize: function ( opt ) {
  		++this.dialogIndex;

  		this._config  = opt = $.extend({}, config, this._config, opt);

		opt.useMask && this.createMask();

  		this.createDialog();

  		opt.useClose && this.setCloseBtn();
  		opt.useTitle && this.setTitle();

  	},

  	_getCurDialog: function () {
  		return this.catchAll[this.dialogIndex];
  	},

  	createDialog: function () {
  		var $dialog = $(this._config.container).attr({'id':'dilog-id-'+this.dialogIndex});
  			$dialog.css({'z-index': this._getZINDEX(), 'width': this._config.width+'px', 'height': this._config.height} );

  		    $dialog.find('[data-role=dialog-content]').html( this._config.content);

  		this.catchAll[this.dialogIndex] = $.extend({}, this.catchAll[this.dialogIndex], {'dialog': $dialog});

  		this._setPosition();

  		return $dialog;
  	},

  	_destroy: function ($dialog, $mask) {
  		$dialog.remove();
  		$mask.remove();
  		$dialog = null;
  		$mask = null;
  	},

  	_addEvent: function () {
  		var that = this;
  		var opt = this._config;
  		if (opt.useClose){
  			this._getCurDialog().dialog.on('click', '[data-role=dialog-close]', function () { that.close(); });
  		}
  		if (opt.maskClose) {
  			this._getCurDialog().mask.on('click', function () { that.close(); });
  		}
  	},

  	_getContent: function () {

  	},

  	_getDialogIndex: function () {

  	},

  	_getZINDEX: function () {
  		return ++this._config.zIndex;
  	},

  	createMask: function () {

  		this.catchAll[this.dialogIndex] = $.extend({}, this.catchAll[this.dialogIndex], {'mask': $('<div class="dialog-mask" style="z-index:'+this._getZINDEX()+'"></div>')});

  	},

  	setCloseBtn: function () {
  		var $close = this._getCurDialog().dialog.find('[data-role=dialog-close]');
  		$close.addClass( this._config.deleteClass ).show(); 
  	},
  	setTitle: function () {
  		this._getCurDialog().dialog.find('[data-role=dialog-title]').html( this._config.title).parent().show();
  	},

  	_setPosition: function () {
  		var pos = this._calculatePosition();
  		this._getCurDialog().dialog.css({'left':pos.left+'px', 'top':pos.top+'px'} );
  	},

    /**
     * 计算对话框位置
     * @method _calculatePosition
     * @return {Object} position 包含top和left值
     * @private
     */
    _calculatePosition: function() {
      var dialog = this._getCurDialog().dialog,
          top = this._config.top,
          left = this._config.left,
          dom, win, winPosTop, winPosLeft, position;

      // 如果设置为居中，则计算；否则直接使用left&top的值
      if (this._config.center) {
        win = $(window);
        position = dialog.css('position');

        winPosTop = Math.max((win.height() - dialog.height()) / 2, 0);
        winPosLeft = Math.max((win.width() - dialog.width()) / 2, 0);

        /*console.log( winPosTop  );
 		console.log(dialog.height() );
		console.log( win.height() );
		*/
        if (position === 'fixed') {
          top = top ? top : winPosTop;
          left = winPosLeft;
        } else {
          dom = $(window.document);
          top = top ? top : dom.scrollTop() + winPosTop;
          left = dom.scrollLeft() + winPosLeft;
        }
      }

      return {top: top, left: left};
    }

  };

	Dialog.getInstanceof = function( opt ) {
		if (!Dialog._instanceof) {

			Dialog._instanceof = new Dialog( );
		}

		return Dialog._instanceof;
	};

	window.DialogSingle = $.DialogSingle = Dialog.getInstanceof();


}(jQuery, window));