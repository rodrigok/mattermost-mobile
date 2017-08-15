// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import PropTypes from 'prop-types';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

import {getCodeFont} from 'app/utils/markdown';
import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';

const {
    width: deviceWidth
} = Dimensions.get('window');

export default class Code extends React.PureComponent {
    static propTypes = {
        theme: PropTypes.object.isRequired,
        content: PropTypes.string.isRequired
    };

    countLines = (content) => {
        return content.split('\n').length;
    }

    render() {
        const style = getStyleSheet(this.props.theme);

        const numberOfLines = this.countLines(this.props.content);
        const lineNumbers = [];
        for (let i = 0; i < numberOfLines; i++) {
            const line = (i + 1).toString();

            lineNumbers.push(
                <Text
                    key={line}
                    style={style.lineNumbersText}
                >
                    {line}
                </Text>
            );
        }

        let lineNumbersStyle;
        if (numberOfLines >= 10) {
            lineNumbersStyle = [style.lineNumbers, style.lineNumbersRight];
        } else {
            lineNumbersStyle = style.lineNumbers;
        }

        return (
            <ScrollView
                style={style.scrollContainer}
                contentContainerStyle={style.container}
            >
                <View style={lineNumbersStyle}>
                    {lineNumbers}
                </View>
                <ScrollView
                    style={style.codeContainer}
                    contentContainerStyle={style.code}
                    horizontal={true}
                >
                    <Text style={style.codeText}>
                        {this.props.content}
                    </Text>
                </ScrollView>
            </ScrollView>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        scrollContainer: {
            flex: 1
        },
        container: {
            minHeight: '100%',
            flexDirection: 'row'
        },
        lineNumbers: {
            alignItems: 'center',
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.05),
            borderRightColor: changeOpacity(theme.centerChannelColor, 0.15),
            borderRightWidth: StyleSheet.hairlineWidth,
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingVertical: 4,
            paddingHorizontal: 6
        },
        lineNumbersRight: {
            alignItems: 'flex-end'
        },
        lineNumbersText: {
            color: changeOpacity(theme.centerChannelColor, 0.5),
            fontSize: 12,
            lineHeight: 18
        },
        codeContainer: {
            flexGrow: 0,
            flexShrink: 1,
            width: deviceWidth
        },
        code: {
            paddingHorizontal: 6,
            paddingVertical: 4
        },
        codeText: {
            fontFamily: getCodeFont(),
            fontSize: 12,
            lineHeight: 18
        }
    };
});
