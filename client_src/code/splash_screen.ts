export{};
const {Component, chain_func} = require("../client/index.js");

class SplashScreen extends Component {
	constructor(atom: any, template: any) {
		super(atom, template);
		this.fading = false;
		this.fade_start = 0;
		this.fade_len = 1500;
		this.a.del = chain_func(this.a.del, this.del.bind(this));
		this.a.on_render_tick = chain_func(this.a.on_render_tick, this.on_render_tick.bind(this));
		this.a.draw = chain_func(this.a.draw, this.draw.bind(this));
	}

	on_render_tick(prev: any) {
		prev();
		if (this.fading) {
			this.a.mark_dirty();
		}
	}

	draw(prev: any, ctx: any, timestamp: any) {
		const old_alpha = ctx.globalAlpha;
		if (this.fading) {
			ctx.globalAlpha *= 1 - (1 / this.fade_len) * (timestamp - this.fade_start);
		}
		prev();
		ctx.globalAlpha = old_alpha;
	}

	del(prev: any) {
		this.fading = true;
		this.fade_start = performance.now();
		setTimeout(prev, this.fade_len);
	}
}

module.exports.components = {SplashScreen};
