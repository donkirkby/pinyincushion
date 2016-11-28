import React from 'react';
import ReactDOM from 'react-dom';
import * as TU from 'react-addons-test-utils';

import charData from './charData';
import {computeBgColorClassName, HandleChar} from './draftDecorators.js';


it('computeBgColorClassName', () => {
    expect(computeBgColorClassName(1)).toEqual('bg-primary');
    expect(computeBgColorClassName(101)).toEqual('bg-success');
    expect(computeBgColorClassName(401)).toEqual('bg-info');
    expect(computeBgColorClassName(901)).toEqual('bg-warning');
    expect(computeBgColorClassName(4001)).toEqual('bg-danger');
    expect(computeBgColorClassName(9999)).toEqual('bg-muted');
});


it('HandleChar', () => {
    const component = TU.renderIntoDocument(
        /* 人 or any most common text */
        <HandleChar decoratedText="人" />
    );

    expect(component.props.decoratedText).toEqual('人');

    /* span has the same API as web DOM api */
    let span = TU.findRenderedDOMComponentWithTag(component, 'span');

    /* bg-primary because it should be a very common character */
    expect(span.className).toEqual('bg-primary');

    /* the text inside span will be harder to test since it only appears in
    nested span element in real case. Here since HandleChar is rendered into a
    detached DOM node by renderIntoDocument, the text hasn't showed up yet */
    expect(span.children.length === 0);
});


