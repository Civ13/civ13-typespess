function anim_loop(this: any, timestamp: any) {
	for (const eye of Object.values(this.eyes)) {
		if (eye) {
			const teye: any = eye;
			teye.draw(timestamp);
		}
	}

	if (this.audio_ctx) {
		for (const sound of this.playing_sounds.values()) {
			sound.update_spatial(sound.emitter, timestamp);
		}
	}

	requestAnimationFrame(anim_loop.bind(this));
}

module.exports = anim_loop;
