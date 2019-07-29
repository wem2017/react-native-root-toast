import React, { Component } from "react";
import PropTypes from "prop-types";
import {
    ViewPropTypes,
    StyleSheet,
    View,
    Text,
    Animated,
    TouchableOpacity,
    Easing
} from "react-native";

const TOAST_ANIMATION_DURATION = 200;
const styles = StyleSheet.create({
    defaultStyle: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 40,
        bottom: 20,
        alignItems: "center"
    },
    containerStyle: {
        paddingHorizontal: 16,
        backgroundColor: "#000",
        opacity: 0.8,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        width: "90%"
    },
    textStyle: {
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
        paddingVertical: 10
    },
    textActionStyle: {
        paddingVertical: 10,
        fontSize: 14,
        color: "#fe9c8b",
        textAlign: "center"
    },
    actionStyle: {
        height: "100%"
    }
});

class ToastContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: this.props.visible,
            opacity: new Animated.Value(0)
        };
    }

    _animating = false;
    _root = null;
    _hideTimeout = null;
    _showTimeout = null;

    componentDidMount = () => {
        if (this.state.visible) {
            this._showTimeout = setTimeout(
                () => this._show(),
                this.props.delay
            );
        }
    };

    componentWillReceiveProps = nextProps => {
        if (nextProps.visible !== this.props.visible) {
            if (nextProps.visible) {
                clearTimeout(this._showTimeout);
                clearTimeout(this._hideTimeout);
                this._showTimeout = setTimeout(
                    () => this._show(),
                    this.props.delay
                );
            } else {
                this._hide();
            }

            this.setState({
                visible: nextProps.visible
            });
        }
    };

    _show = () => {
        clearTimeout(this._showTimeout);
        if (!this._animating) {
            clearTimeout(this._hideTimeout);
            this._animating = true;
            this._root.setNativeProps({
                pointerEvents: "auto"
            });
            Animated.timing(this.state.opacity, {
                toValue: this.props.opacity,
                duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
                easing: Easing.out(Easing.ease)
            }).start(({ finished }) => {
                if (finished) {
                    this._animating = !finished;
                    this.props.onShow && this.props.onShow();
                    if (this.props.duration > 0) {
                        this._hideTimeout = setTimeout(
                            () => this._hide(),
                            this.props.duration
                        );
                    }
                }
            });
        }
    };

    _hide = (type = "timeout") => {
        clearTimeout(this._showTimeout);
        clearTimeout(this._hideTimeout);
        if (!this._animating) {
            this._root.setNativeProps({
                pointerEvents: "none"
            });
            Animated.timing(this.state.opacity, {
                toValue: 0,
                duration: this.props.animation ? TOAST_ANIMATION_DURATION : 0,
                easing: Easing.in(Easing.ease)
            }).start(({ finished }) => {
                if (finished) {
                    this._animating = false;
                    this.props.onHide && this.props.onHide(type);
                    this.setState({ visible: false });
                }
            });
        }
    };

    render() {
        const {
            position,
            containerStyle,
            textStyle,
            textActionStyle,
            actionStyle,
            enableAction,
            textAction,
            children
        } = this.props;
        const { visible } = this.state;
        let containPosition = {};
        if (position == "top") {
            containPosition = {
                justifyContent: "flex-start"
            };
        } else if (position == "bottom") {
            containPosition = {
                justifyContent: "flex-end"
            };
        }
        return visible || this._animating ? (
            <View
                style={[styles.defaultStyle, containPosition]}
                pointerEvents="box-none"
            >
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => this._hide("onPress")}
                    style={{ width: "100%", alignItems: "center" }}
                >
                    <Animated.View
                        style={[
                            styles.containerStyle,
                            {
                                opacity: this.state.opacity
                            },
                            containerStyle
                        ]}
                        pointerEvents="none"
                        ref={ele => (this._root = ele)}
                    >
                        <Text
                            style={[styles.textStyle, textStyle]}
                            numberOfLines={1}
                        >
                            {children}
                        </Text>
                        {enableAction && (
                            <TouchableOpacity
                                style={[styles.actionStyle, actionStyle]}
                                activeOpacity={0.8}
                                onPress={() => this._hide("onPressAction")}
                            >
                                <Text
                                    style={[
                                        styles.textActionStyle,
                                        textActionStyle
                                    ]}
                                >
                                    {textAction}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </TouchableOpacity>
            </View>
        ) : null;
    }
}

ToastContainer.propTypes = {
    containerStyle: ViewPropTypes.style,
    textStyle: Text.propTypes.style,
    textActionStyle: Text.propTypes.style,
    actionStyle: ViewPropTypes.style,
    duration: PropTypes.number,
    position: PropTypes.string,
    animation: PropTypes.bool,
    opacity: PropTypes.number,
    delay: PropTypes.number,
    visible: PropTypes.bool,
    enableAction: PropTypes.bool,
    onHide: PropTypes.func,
    onShow: PropTypes.func
};

ToastContainer.defaultProps = {
    containerStyle: {},
    textStyle: {},
    textActionStyle: {},
    actionStyle: {},
    duration: 2000,
    position: "bottom",
    textAction: "Action",
    opacity: 0.8,
    delay: 0,
    visible: false,
    enableAction: false,
    animation: true,
    onHide: () => {},
    onShow: () => {}
};
export default ToastContainer;
