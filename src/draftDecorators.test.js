import React from 'react';
import ReactDOM from 'react-dom';
import * as TU from 'react-addons-test-utils';

import charData from './charData';
import {computeBgColorClassName, HandleChar} from './draftDecorators.js';


it('HandleChar', () => {
    const component = TU.renderIntoDocument(
        /* 人 or any most common text */
        <HandleChar decoratedText="幾" />
    );

    expect(component.props.decoratedText).toEqual('幾');

    /* span has the same API as web DOM api */
    let span = TU.findRenderedDOMComponentWithTag(component, 'span');

    /* bg-primary because it should be a very common character */
    expect(span.className).toEqual('bg-danger');

    /* the text inside span will be harder to test since it only appears in
    nested span element in real case. Here since HandleChar is rendered into a
    detached DOM node by renderIntoDocument, the text hasn't showed up yet */
    expect(span.children.length === 0);
});


