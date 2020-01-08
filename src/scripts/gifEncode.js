import './gif_encoder/GIFEncoder'
import './gif_encoder/LZWEncoder'
import './gif_encoder/NeuQuant'
import { encode64 } from './gif_encoder/b64'

function gifEncoder(fps, ctx) {
    fps = Math.floor(1000 / fps);
    const encoder = new GIFEncoder();
    encoder.setRepeat(0);
    encoder.setDelay(fps);
    encoder.start();
    for (let i of ctx) {
        encoder.addFrame(i);
    }
    encoder.finish();
    const binary_gif = encoder.stream().getData();
    const data_url = 'data:image/gif;base64,'+encode64(binary_gif);
    return data_url;
}

export { gifEncoder }