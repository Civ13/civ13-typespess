export{};
class Sound {
	emit_from() {
		throw new Error("Method not implemented.");
	}
	client: any;
	emitter: any;
	id: any;
	buffer_promise: any;
	source: any;
	spatial_node: any;
	constructor(client: any, sndobj: any) {
		this.client = client;
		if (typeof sndobj.emitter === "string") {
			sndobj.emitter = this.client.atoms_by_netid[sndobj.emitter];
		}
		this.emitter = sndobj.emitter;
		this.id = sndobj.id || "id" + Math.random();
		this.client.playing_sounds.set(this.id, this);
		this.buffer_promise = this.client.get_audio_buffer(client, sndobj.path);
		if (!this.client.audio_ctx) {return;}
		this.source = this.client.audio_ctx.createBufferSource();
		if (sndobj.detune) {
			this.source.detune.value = sndobj.detune;
		}
		if (sndobj.playback_rate) {
			this.source.playbackRate.value = sndobj.playback_rate;
		}
		if (sndobj.loop) {
			this.source.loop = true;
		}
		this.apply_effects(sndobj, this.source).connect(this.client.audio_ctx.destination);
	}

	apply_effects(sndobj: {volume?: any; emitter?: any}, node: any) {
		if (sndobj.volume) {
			node = this.apply_volume(sndobj.volume, node);
		}
		if (sndobj.emitter) {
			node = this.apply_spatial(sndobj.emitter, node);
		}
		return node;
	}

	apply_volume(amount: any, node: {connect: (arg0: any) => void}) {
		const gain = this.client.audio_ctx.createGain();
		gain.gain.value = amount;
		node.connect(gain);
		return gain;
	}

	apply_spatial(emitter: any, node: {connect: (arg0: any) => void}) {
		this.spatial_node = this.client.audio_ctx.createPanner();
		this.spatial_node.panningModel = "HRTF";
		node.connect(this.spatial_node);
		this.update_spatial(emitter, performance.now());
		return this.spatial_node;
	}

	update_spatial(emitter: {eye: any; eye_id: any; x: number; y: number}, timestamp: number) {
		if (this.spatial_node) {
			const eye = emitter.eye || this.client.eyes[emitter.eye_id || ""];
			if (!eye) {
				return;
			}
			const eye_disp = eye.origin.get_displacement(timestamp);
			if (eye_disp.dispx !== +eye_disp.dispx || eye_disp.dispy !== +eye_disp.dispy) {
				return;
			}
			if (emitter.x !== +emitter.x || emitter.y !== +emitter.y) {
				return;
			}
			this.spatial_node.setPosition(emitter.x - eye_disp.dispx, 0, -emitter.y + eye_disp.dispy);
		}
	}

	start() {
		if (!this.client.audio_ctx) {return;}
		this.buffer_promise.then((buf: any) => {
			if (!this.source) {
				return;
			}
			this.source.buffer = buf;
			this.source.addEventListener("ended", this.ended.bind(this));
			this.source.start();
			this.stop = () => {
				this.source.stop();
				this.source = null;
			};
		});
	}

	stop() {
		this.ended();
		this.source = null;
	}

	ended() {
		this.client.playing_sounds.delete(this.id);
	}
}

module.exports = Sound;
