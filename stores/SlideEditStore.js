import {BaseStore} from 'fluxible/addons';

class SlideEditStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        //this.dispatcher = dispatcher; // Provides access to waitFor and getStore methods
        this.id = '';
        this.title = '';
        this.content = '';
        this.speakernotes = '';
        this.scaleratio = 1; //default no scale ratio
        this.template = '';
        this.addInputBox = 'false';
        this.uploadMediaClick = 'false';
        this.uploadVideoClick = 'false';
        this.otherClick = 'false';
        this.embedClick = 'false';
        this.HTMLEditorClick = 'false';
    }
    updateContent(payload) {
        //console.log('test' + payload + payload.slide.content + ' title: ' +  payload.slide.title + ' id: ' + payload.slide.id);
        //console.log('test' + payload.slide.revisions[0].title + ' id: ' + payload.slide.id);
        //console.log('test' + payload.slide.revisions[payload.slide.revisions.length-1]);
        if (payload.slide.revisions !== undefined)
        {
            this.id = payload.slide.id;
            let lastRevision = payload.slide.revisions[payload.slide.revisions.length-1];
            this.title = lastRevision.title? lastRevision.title: ' ';
            this.content = lastRevision.content? lastRevision.content: ' ';
            this.speakernotes = lastRevision.speakernotes? lastRevision.speakernotes: ' ';

            this.emitChange();
        }
        else
        {
            this.title = 'title not found';
            this.content = 'content not found';
            this.speakernotes = 'speaker notes not found';
            this.emitChange();
        }
    }
    saveSlide() {
        this.emitChange();
    }
    addSlide() {
        this.emitChange();
    }
    changeTemplate(payload){
        this.template = payload.template;
        this.emitChange();
        this.template = '';
        this.emitChange();
    }
    handleAddInputBox(){
        this.addInputBox = 'true';
        this.emitChange();
        this.addInputBox = 'false';
        this.emitChange();
    }
    handleUploadMedia(){
        this.uploadMediaClick = 'true';
        this.emitChange();
        this.uploadMediaClick = 'false';
        this.emitChange();
    }
    handleuploadVideoClick(){
        this.uploadVideoClick = 'true';
        this.emitChange();
        this.uploadVideoClick = 'false';
        this.emitChange();
    }
    handleOtherClick(){
        this.otherClick = 'true';
        this.emitChange();
        this.otherClick = 'false';
        this.emitChange();
    }
    handleEmbedClick(){
        this.embedClick = 'true';
        this.emitChange();
        this.embedClick = 'false';
        this.emitChange();
    }
    handleHTMLEditorClick(){
        this.HTMLEditorClick = 'true';
        this.emitChange();
        this.HTMLEditorClick = 'false';
        this.emitChange();
    }

    getState() {
        return {
            id: this.id,
            title: this.title,
            content: this.content,
            speakernotes: this.speakernotes,
            scaleratio: this.scaleratio,
            template: this.template,
            addInputBox: this.addInputBox,
            uploadMediaClick: this.uploadMediaClick,
            uploadVideoClick: this.uploadVideoClick,
            otherClick: this.otherClick,
            embedClick: this.embedClick,
            HTMLEditorClick: this.HTMLEditorClick
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.id = state.id;
        this.title = state.title;
        this.content = state.content;
        this.speakernotes = state.speakernotes;
        this.scaleratio = state.scaleratio;
        this.template = state.template;
        this.addInputBox = state.addInputBox;
        this.uploadMediaClick = state.uploadMediaClick;
        this.uploadVideoClick = state.uploadVideoClick;
        this.otherClick = state.otherClick;
        this.embedClick = state.embedClick;
        this.HTMLEditorClick = state.HTMLEditorClick;
    }
}

SlideEditStore.storeName = 'SlideEditStore';
SlideEditStore.handlers = {
    'LOAD_SLIDE_EDIT_SUCCESS': 'updateContent',
    'SAVE_SLIDE_EDIT_SUCCESS': 'saveSlide',
    'ADD_SLIDE_EDIT_SUCCESS': 'addSlide',
    'CHANGE_TEMPLATE': 'changeTemplate',
    'ADD_INPUT_BOX': 'handleAddInputBox',
    'UPLOAD_MEDIA_CLICK': 'handleUploadMedia',
    'UPLOAD_VIDEO_CLICK': 'handleuploadVideoClick',
    'OTHER_CLICK': 'handleOtherClick',
    'EMBED_CLICK': 'handleEmbedClick',
    'HTML_EDITOR_CLICK': 'handleHTMLEditorClick',
};

export default SlideEditStore;
