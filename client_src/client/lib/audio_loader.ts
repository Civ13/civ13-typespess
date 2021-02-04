function get_audio_buffer(url) {
	const old_buf = this.audio_buffers.get(url);
	if (old_buf) {return old_buf;}

	const promise = new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", this.resRoot + url, true);
		xhr.responseType = "arraybuffer";
		xhr.onload = () => {
			const data = xhr.response;
			resolve(this.audio_ctx.decodeAudioData(data));
		};
		xhr.onerror = (err) => {
			reject(err);
		};
		xhr.send();
	});
	this.audio_buffers.set(url, promise);
	return promise;
}

module.exports = get_audio_buffer;
