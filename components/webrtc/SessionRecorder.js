import React from 'react';
import { isEmpty } from '../../common';
import { Button, Icon } from 'semantic-ui-react';

class SessionRecorder extends React.Component {

/*
  Props:
*/

    constructor(props) {
        super(props);
        this.mediaRecorder = undefined;
        this.blobKeys = [];
        this.state = {
            recordSession: true
        };
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.state.recordSession !== nextState.recordSession){
            this.blobKeys = [];
            window.localforage.clear();
            try {
                this.mediaRecorder.stop();
            } catch (e) {}
        }

    }

    recordSessionModal() {
        return swal({
            titleText: 'Do you want to record this session?',
            html: '<p>We provide the possibility to record this session and to create a video out of it. If you want us to record this session, please click "Yes" below. If not, please click "No".</p><p>We are only recording slide changes and your voice (nothing else). All data stays on your computer until you tell us to create a video out of it. Videos can by only created on our servers due to technological reasons. So if you change your mind and do not want upload anything to us, do not hit the "Save session as video" button in the end. Otherwise, remember to hit this button in the end. <strong>It is not possible to recover a once closed session.</strong></p>',
            type: 'info',
            width: '46rem',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes, record this session',
            showCancelButton: true,
            cancelButtonText: 'No, do not record anything',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).catch((e) => {
            if(e === 'cancel'){
                this.setState({recordSession: false});
            }
        });
    }

    recordStream(stream) {
        if(this.state.recordSession){
            // console.log('Initializing recorder');
            this.mediaRecorder = new MediaStreamRecorder(stream);
            this.mediaRecorder.stream = stream;
            // this.mediaRecorder.disableLogs = true;
            this.mediaRecorder.mimeType = 'audio/webm';
            this.mediaRecorder.ondataavailable = (blob) => {
                console.log('New blob available');
                let now = new Date().getTime();
                this.blobKeys.push(now.toString());
                window.localforage.setItem(now.toString(), blob); //TODO implement catch for promise
            };
            console.log('starting recorder');
            this.mediaRecorder.start(5000);//NOTE 5000 is the only option that works
        }
    }

    StartRecordSlideChanges(deckID, url = '') {
        if(this.state.recordSession){
            if(window.sessionStorage) {
                sessionStorage.setItem('deck', deckID);
                sessionStorage.setItem('origin', window.location.origin);
                sessionStorage.setItem('slideTimings', '');//clear it
                this.recordSlideChange(url, true);
            }
        }
    }

    recordSlideChange(url = '', first = false) {
        if(this.state.recordSession){
            // console.log('recording slide change', url, first);
            if(window.sessionStorage){
                let prev = sessionStorage.getItem('slideTimings');
                prev = (isEmpty(prev)) ? '{}' : prev;
                prev = JSON.parse(prev);
                let now = new Date().getTime();
                let newEl = {};
                newEl[now] = ((first) ? sessionStorage.getItem('origin') : '') + url;
                let toSave = Object.assign(prev, newEl);
                sessionStorage.setItem('slideTimings', JSON.stringify(toSave));
            }
        }
    }

    saveRecording() {
        this.mediaRecorder.pause();
        swal({
            titleText: 'Save this session as a video?',
            text: 'We will upload your speech and slide changes (nothing else) to our servers and create a video out of it. This is, due to technologcial reasons, only possible serverside. If you agree, please click "Yes". If you do not want to upload something, please click "No". We will continue to record until you either close this window or save your session as a video.',
            type: 'question',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Yes',
            showCancelButton: true,
            cancelButtonText: 'No',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            allowEscapeKey: false
        }).then(() => {
            this.mediaRecorder.stop();
            this.recordSlideChange();
            let timingBlob = new Blob([sessionStorage.getItem('slideTimings')], {type: 'application/json'});
            this.saveBlob(timingBlob, 'timings.json');//TODO last recording is just a time, but no slide url as this component triggers it and this.currentSlide is not available in this component
            this.getBlobArray(this.saveAudioTrack);
        }).catch((e) => {
            if(e === 'cancel'){
                this.mediaRecorder.resume();
            }
        });
    }

    getBlobArray(callback) {
        let promises = this.blobKeys.map((key) => window.localforage.getItem(key));
        Promise.all(promises).then((values) => {
            callback(values);
        });
    }

    saveAudioTrack(blobArray) {
        let safeBlobArray = (isEmpty(blobArray)) ? [] : blobArray;
        console.log(safeBlobArray);
        window.ConcatenateBlobs( safeBlobArray, safeBlobArray[0].type, (concatenatedBlob) => {
            //this.saveBlob(concatenatedBlob, 'test.webm');//TODO calling saveBlob did not work because "this" was not known
            let hyperlink = document.createElement('a');
            hyperlink.style.display = 'none';
            hyperlink.href = URL.createObjectURL(concatenatedBlob);
            hyperlink.target = '_blank';
            hyperlink.download = 'test.webm';

            hyperlink.click();
        });
    }

    saveBlob(file, fileName) {
        let hyperlink = document.createElement('a');
        hyperlink.style.display = 'none';
        hyperlink.href = URL.createObjectURL(file);
        hyperlink.target = '_blank';
        hyperlink.download = fileName;

        hyperlink.click();
    }

    render() {
        return (
          <Button content="Save session as video" color='grey' labelPosition='right' icon={<Icon name="record" color={(this.state.recordSession) ? 'red' : ''}/>} disabled={this.state.recordSession ? false : true} style={{textAlign: 'left'}} onClick={this.saveRecording.bind(this)} aria-haspopup="true" data-tooltip={this.state.recordSession ? ' Recording...': 'Recording is disabled'} data-position="top left"/>
        );
    }
}

SessionRecorder.contextTypes = {
    executeAction: React.PropTypes.func.isRequired
};

export default SessionRecorder;