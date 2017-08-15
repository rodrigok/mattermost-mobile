// Copyright (c) 2017-present Mattermost, Inc. All Rights Reserved.
// See License.txt for license information.

import {PropTypes} from 'prop-types';
import React from 'react';
import {injectIntl, intlShape} from 'react-intl';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import CustomPropTypes from 'app/constants/custom_prop_types';
import FormattedText from 'app/components/formatted_text';
import {getDisplayNameForLanguage} from 'app/utils/markdown';
import {wrapWithPreventDoubleTap} from 'app/utils/tap';
import {changeOpacity, makeStyleSheetFromTheme} from 'app/utils/theme';

const MAX_LINES = 4;

class MarkdownCodeBlock extends React.PureComponent {
    static propTypes = {
        intl: intlShape.isRequired,
        navigator: PropTypes.object.isRequired,
        theme: PropTypes.object.isRequired,
        language: PropTypes.string,
        content: PropTypes.string.isRequired,
        textStyle: CustomPropTypes.Style
    };

    static defaultProps = {
        language: ''
    };

    handlePress = wrapWithPreventDoubleTap(() => {
        const {intl, navigator, theme} = this.props;

        const languageDisplayName = getDisplayNameForLanguage(this.props.language);
        let title;
        if (languageDisplayName) {
            title = intl.formatMessage(
                {
                    id: 'mobile.routes.code',
                    defaultMessage: '{language} Code'
                },
                {
                    language: languageDisplayName
                }
            );
        } else {
            title = intl.formatMessage({
                id: 'mobile.routes.code.noLanguage',
                defaultMessage: 'Code'
            });
        }

        navigator.push({
            screen: 'Code',
            title,
            animated: true,
            backButtonTitle: '',
            passProps: {
                content: this.props.content
            },
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg
            }
        });
    });

    trimContent = (content) => {
        const lines = content.split('\n');
        const numberOfLines = lines.length;

        if (numberOfLines > MAX_LINES) {
            return {
                content: lines.slice(0, MAX_LINES).join('\n'),
                numberOfLines
            };
        }

        return {
            content,
            numberOfLines
        };
    };

    render() {
        const style = getStyleSheet(this.props.theme);

        let language = null;
        if (this.props.language) {
            const languageDisplayName = getDisplayNameForLanguage(this.props.language);

            if (languageDisplayName) {
                language = (
                    <View style={style.language}>
                        <Text style={style.languageText}>
                            {languageDisplayName}
                        </Text>
                    </View>
                );
            }
        }

        const {content, numberOfLines} = this.trimContent(this.props.content);

        let lineNumbers = '1';
        for (let i = 1; i < Math.min(numberOfLines, MAX_LINES); i++) {
            const line = (i + 1).toString();

            lineNumbers += '\n' + line;
        }

        let plusMoreLines = null;
        if (numberOfLines > MAX_LINES) {
            plusMoreLines = (
                <FormattedText
                    style={style.plusMoreLinesText}
                    id='mobile.markdown.code.plusMoreLines'
                    defaultMessage='+{count, number} more lines'
                    values={{
                        count: numberOfLines - MAX_LINES
                    }}
                />
            );
        }

        return (
            <TouchableOpacity onPress={this.handlePress}>
                <View style={style.container}>
                    <View style={style.lineNumbers}>
                        <Text style={style.lineNumbersText}>
                            {lineNumbers}
                        </Text>
                    </View>
                    <View style={style.rightColumn}>
                        <View style={style.code}>
                            <Text style={[style.codeText, this.props.textStyle]}>
                                {content}
                            </Text>
                        </View>
                        {plusMoreLines}
                    </View>
                    {language}
                </View>
            </TouchableOpacity>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            borderColor: changeOpacity(theme.centerChannelColor, 0.15),
            borderRadius: 3,
            borderWidth: StyleSheet.hairlineWidth,
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
            width: 21
        },
        lineNumbersText: {
            color: changeOpacity(theme.centerChannelColor, 0.5),
            fontSize: 12,
            lineHeight: 18
        },
        rightColumn: {
            flexDirection: 'column',
            flex: 1,
            paddingHorizontal: 6,
            paddingVertical: 4
        },
        code: {
            flexDirection: 'row',
            overflow: 'scroll' // Doesn't actually cause a scrollbar, but stops text from wrapping
        },
        codeText: {
            fontSize: 12,
            lineHeight: 18
        },
        plusMoreLinesText: {
            color: changeOpacity(theme.centerChannelColor, 0.4),
            fontSize: 11,
            marginTop: 2
        },
        language: {
            alignItems: 'center',
            backgroundColor: theme.sidebarHeaderBg,
            justifyContent: 'center',
            opacity: 0.8,
            padding: 6,
            position: 'absolute',
            right: 0,
            top: 0
        },
        languageText: {
            color: theme.sidebarHeaderTextColor,
            fontSize: 12
        }
    };
});

export default injectIntl(MarkdownCodeBlock);
