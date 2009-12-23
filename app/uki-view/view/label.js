include('../../uki-core/const.js');

(function() {

var Base = uki.view.Base[PROTOTYPE];

uki.view.Label = uki.newClass(uki.view.Base, {
    init: function() {
        Base.init.apply(this, arguments);
        this._scrollable = false;
        this._selectable = false;
        this._inset = new Inset();
        this._label = uki.createElement('div', Base.defaultCss + 
            "font-family:Helvetica-Neue,Helvetica,Arial,sans-serif;font-size:12px;line-height:12px;white-space:nowrap;"); // text-shadow:0 1px 0px rgba(255,255,255,0.8);
    },
    
    typeName: function() {
        return 'uki.view.Label';
    },
    
    selectable: function(state) {
        if (state !== undefined) {
            this._label.unselectable = state ? '' : 'on';
        }
        return Base.selectable.call(this, state);
    },
    
    fontSize: function(size) {
        if (size === undefined) return this._label.style.fontSize;
        
        this._label.style.fontSize = this._label.style.lineHeight = size + 'px';
        return this;
    },
    
    /**
     * Warning! this operation is expensive
     */
    contentsSize: function() {
        var clone = this._createLabelClone(), inset = this.inset(), size;
        
        uki.dom.probe(clone, function() {
            size = new Size(clone.offsetWidth + inset.width(), clone.offsetHeight + inset.height());
        });
        
        return size;
    },
    
    _createLabelClone: function() {
        var clone = this._label.cloneNode(true),
            inset = this.inset(), rect = this.rect();
            
        if (this._autosizeToContents & AUTOSIZE_WIDTH) {
            clone.style.width = clone.style.right = '';
        } else if (uki.supportNativeLayout) {
            clone.style.right = '';
            clone.style.width = rect.width - inset.width() + 'px';
        }
        if (this._autosizeToContents & AUTOSIZE_HEIGHT) {
            clone.style.height = clone.style.bottom = '';
        } else if (uki.supportNativeLayout) {
            clone.style.bottom = '';
            clone.style.height = rect.height - inset.height() + 'px';
        }
        clone.style.paddingTop = 0;
        clone.style.visibility = 'hidden';
        return clone;
    },
    
    _createDom: function() {
        Base._createDom.call(this);
        this._dom.appendChild(this._label);
    },
    
    _layoutDom: function() {
        Base._layoutDom.apply(this, arguments);
        var inset = this._inset;
        // if (!this.multiline()) this._label.style.lineHeight = (this._rect.height - inset.top - inset.bottom) + 'px';
        if (!this.multiline()) this._label.style.paddingTop = (this._rect.height/2 - 6) + 'px';
        var l;
        
        if (uki.supportNativeLayout) {
            l = {
                left: inset.left, 
                top: inset.top, 
                right: inset.right,
                bottom: inset.bottom
            };
        } else {
            l = {
                left: inset.left, 
                top: inset.top, 
                width: this._rect.width - inset.width(),
                height: this._rect.height - inset.height()
            };
        }
        this._lastLabelLayout = uki.dom.layout(this._label.style, l, this._lastLabelLayout);
    },
    
    text: function(text) {
        return text === undefined ? this.html() : this.html(uki.escapeHTML(text));
    },
    
    html: function(html) {
        if (html === undefined) return this._label.innerHTML;
        this._label.innerHTML = html;
        return this;
    },
    
    align: function(align) {
        if (align === undefined) return this._label.style.textAlign;
        this._label.style.textAlign = align;
        return this;
    },
    
    inset: function(inset) {
        if (inset === undefined) return this._inset;
        this._inset = Inset.create(inset);
        return this;
    },

    scrollable: function(state) {
        if (state === undefined) return this._scrollable;
        this._scrollable = state;
        this._label.style.overflow = state ? 'auto' : 'hidden';
        return this;
    },
    
    multiline: function(state) {
        if (state === undefined) return this._label.style.whiteSpace != 'nowrap';
        this._label.style.whiteSpace = state ? '' : 'nowrap';
        // if (this._rect) this._label.style.lineHeight = state ? '' : this._rect.height + 'px';
        return this;
    }
});
    
})();