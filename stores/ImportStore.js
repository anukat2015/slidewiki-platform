import {BaseStore} from 'fluxible/addons';

class ImportStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.resultMessage = '';
        this.isUploaded = false;
        this.file = null;
        this.base64 = null;
    }
    destructor()
    {
        this.resultMessage = '';
        this.isUploaded = false;
        this.file = null;
        this.base64 = null;
    }
    getState() {
        return {
            resultMessage: this.resultMessage,
            isUploaded: this.isUploaded,
            file: this.file,
            base64: this.base64
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.resultMessage = state.resultMessage;
        this.isUploaded = state.isUploaded;
        this.file = state.file;
        this.base64 = state.base64;
    }

    storeFile(payload) {
        console.log('ImportStore: storeFile()', payload);
        this.file = payload.file;
        this.base64 = payload.base64;
        this.emitChange();
    }
    uploadFailed(error) {
        
    }
    uploadSuccess(headers) {

    }
}

ImportStore.storeName = 'ImportStore';
ImportStore.handlers = {
    'STORE_FILE': 'storeFile',
    'IMPORT_FINISHED': 'destructor',
    'UPLOAD_FAILED': 'uploadFailed',
    'UPLOAD_SUCCESS': 'uploadSuccess'
};

export default ImportStore;
