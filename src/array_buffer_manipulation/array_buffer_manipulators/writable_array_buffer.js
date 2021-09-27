import { OpenableArrayBuffer } from './openable_array_buffer';

class WritableArrayBuffer extends OpenableArrayBuffer {
    writeByteView(byteView) {
        this.byteView.set(byteView, this.index);
        this.incrementIndex(byteView.length);
    }
}

export { WritableArrayBuffer };
