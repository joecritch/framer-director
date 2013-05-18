/**
	Copyright 2013 Joe Critchley and other contributors
	http://joecritchley.com/

	Permission is hereby granted, free of charge, to any person obtaining
	a copy of this software and associated documentation files (the
	"Software"), to deal in the Software without restriction, including
	without limitation the rights to use, copy, modify, merge, publish,
	distribute, sublicense, and/or sell copies of the Software, and to
	permit persons to whom the Software is furnished to do so, subject to
	the following conditions:

	The above copyright notice and this permission notice shall be
	included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function FramerDirector(viewConfig, duration, easing) {
	this.viewConfig = viewConfig;
	this.state = null;
	this.duration = duration;
	this.easing = easing;
}

FramerDirector.prototype = {
	getState: function() {
		return this.state;
	},
	setState: function(state, animate) {
		var _this = this;
		animate = animate || false;
		this.state = state;
		this.viewConfig.forEach(function(v, i) {
			if(v.multi) {
				v.states[state].forEach(function(x, k) {
					_this.handleView(PSD[v.id + '-' + (k+1)], x, animate);
				});
			}
			else {
				_this.handleView(PSD[v.id], v.states[state], animate);
			}

			// Handle the children
			if(v.children) {
				_this.handleChildren(v, animate);
			}
		});
	},
	handleChildren: function(parent, animate) {
		animate = animate || false;
		var _this = this;
		for(var childKey in parent.children) {
			if(parent.multi) {
				// Handle child for 'multi'-parents
				_this.handleMultiChild(childKey, parent, animate);
			}
			else {
				// Handle child of multi parent
				_this.handleView(PSD[parent.id + '-' + childKey], parent.children[childKey], animate);
			}
		}
	},
	handleMultiChild: function(childKey, parent, animate) {
		var _this = this;
		parent.children[childKey][_this.state].forEach(function(v, i) {
			var childView = PSD[parent.id + '-' + (i+1) + '-' + childKey];
			_this.handleView(childView, v, animate);
		});
	},
	handleView: function(view, props, animate) {

		var propsToAnimate = {};
		var i;
		var _this = this;

		for(i in props) {
			// Set the defaults for any NULL values
			if(props[i] === null) {
				props[i] = view[i];
			}
			// Don't animate to the same position.
			else if(props[i] !== view[i]) {
				propsToAnimate[i] = props[i];
			}
		}

		animate = animate || false;
		if(animate && Object.keys(propsToAnimate).length) {
			view.animate({
				properties: propsToAnimate,
				time: _this.duration,
				curve: _this.easing
			});
		}
		else {
			for (i in props) {
				view[i] = props[i];
			}
		}
	}
};
