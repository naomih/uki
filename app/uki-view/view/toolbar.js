include('button.js');
include('flow.js');

uki.view.toolbar = {};

uki.view.Toolbar = uki.newClass(uki.view.Container, new function() {
    var Base = uki.view.Container[PROTOTYPE],
        proto = this;
        
    proto.typeName = function() { return 'uki.view.Toolbar'; };
    
    proto._moreWidth = 30;
    
    proto.init = function() {
        Base.init.call(this);
        this._containers = [];
        this._widths = [];
    };
    
    uki.addProps(proto, ['buttons', 'moreWidth']);
    
    proto._createDom = function() {
        Base._createDom.call(this);
        
        var rect = this.rect(),
            flowRect = rect.clone().normalize(),
            moreRect = new Rect(rect.width - this._moreWidth, 0, this._moreWidth, rect.height),
            buttonsML = uki.map(this._buttons, this._createButton, this),
            flowML = { view: 'Flow', rect: flowRect, anchors: 'left top right', className: 'toolbar-flow', horizontal: true, childViews: buttonsML },
            moreML = { view: 'Button', rect: moreRect, anchors: 'right top', className: 'toolbar-button',  backgroundPrefix: 'toolbar-', visible: false, text: '>>' };
            
        this._flow = uki.build(flowML)[0];
        this._more = uki.build(moreML)[0];
        this.appendChild(this._flow);
        this.appendChild(this._more);
        this._initCommonAttrs();
        // this._layoutChildViews();
        uki(this._flow.childViews()).resizeToContents();
        this._flow.rect(flowRect);
        this._totalWidth = uki.reduce(0, this._flow.childViews(), function(s, v) { return s + v.rect().width });
        this._more.visible(rect.width < this._totalWidth);
    };
    
    proto.rect = function(rect) {
        var result = Base.rect.call(this, rect);
        if (this._more && rect !== undefined) {
            this._more.visible(rect.width < this._totalWidth);
        }
        return result;
    };
    
    proto._createButton = function(descr) {
        var size = Size.create(descr.size || '16 16'),
            url  = descr.icon,
            label = descr.label,
            inset = new Inset(0, 4, 0, 8 + size.width);
            html = [label, '<img src="', url, '" width="', size.width, '" height="', size.height, 
                '" style="position:absolute;top: ', (this.rect().height - size.height)/2, 'px;',
                ' left: -', (size.width + 4), 'px;" />'].join('');
        return { 
                view: 'Button', rect: new Rect(100, this.rect().height), focusable: false, align: 'left',
                anchors: 'left top', backgroundPrefix: 'toolbar-', inset: inset, autosizeToContents: 'width', html: html 
            };
    };    
});