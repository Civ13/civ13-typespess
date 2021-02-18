function get_audio_buffer(client: Record<string, any>, url: string) {
	const old_buf = client.audio_buffers.get(url);
	if (old_buf) {
		return old_buf;
	}

	const promise = new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", client.resRoot + url, true);
		xhr.responseType = "arraybuffer";
		xhr.onload = () => {
			const data = xhr.response;
			resolve(client.audio_ctx.decodeAudioData(data));
		};
		xhr.onerror = (err) => {
			reject(err);
		};
		xhr.send();
	});
	client.audio_buffers.set(url, promise);
	return promise;
}

module.exports = get_audio_buffer;
