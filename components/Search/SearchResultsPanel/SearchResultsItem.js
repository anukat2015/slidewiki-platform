import React from 'react';
import classNames from 'classnames/bind';

class SearchResultsItem extends React.Component {



    render() {
        const result = this.props.data;
        const imgpath = '/assets/images/search/';

        // console.log('RESULT: '+JSON.stringify(result));

        let IconNode = '';
        let ResultNode = '';

        const contentStyles = {
            fontStyle: 'italic',
            fontWeight: 400
        };
        const infoStyles = {
            fontWeight: 600
        };

        switch (result.entity) {
            case 'slide':
                IconNode = (<img src={imgpath + 'slide.png'}   height={25} width={25}></img> );
                ResultNode = (
                    <div className="info">
                        <span style={infoStyles}>Slide <a href={'/slideview/' + result.id}>{result.title}</a></span>
                        <br/>
                        <span style={contentStyles}>{result.description.substring(0,100)+'...'}</span>
                    </div>
                );

                break;

            case 'deck':
                IconNode = (<img src={imgpath + 'deck.png'}   height={25} width={25}></img> );
                ResultNode = (
                    <div className="info">
                        <span style={infoStyles}>Deck <a href={'/deck/' + result.id}>{result.title}</a></span>
                        <br/>
                        <span style={contentStyles}>{result.description.substring(0,100)+'...'}</span>
                    </div>
                );
                break;

            // case 'deck_revision':
            //     IconNode = (<img src={imgpath + 'deck.png'}   height={25} width={25}></img> );
            //     ResultNode = (
            //         <div className="info">
            //             <span style={infoStyles}>Deck <a href={'/deck/' + result.did}>{result.dtitle}</a></span>
            //             <br/>
            //             <span style={contentStyles}>{result.abstract + result.comment}</span>
            //         </div>
            //     );
            //     break;
            //
            // case 'answer':
            //     IconNode = (<img src={imgpath + 'answer.png'}   height={25} width={25}></img> );
            //     ResultNode = (
            //         <div className="info">
            //             <span style={infoStyles}>Answer <a href={'/answer/' + result.aid}>{result.aid }</a>
            //             of question <a href={'/question/' + result.qid}>{result.qtitle }</a></span>
            //             <br/>
            //             <span style={contentStyles}>{result.explanation}</span>
            //         </div>
            //     );
            //     break;


        }


        return (
          <div className="ui feed">
              <div className="event">
                  <div className="result-icon" style={{marginLeft: '1em'}}>
                      {IconNode}
                  </div>
                  <div className="content" style={{marginLeft: '1em'}}>
                      {ResultNode}
                  </div>
              </div>
          </div>

        );
    }
}

export default SearchResultsItem;
