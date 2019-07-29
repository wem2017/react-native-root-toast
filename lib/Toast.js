import React, { Component } from "react";
import RootSiblings from "react-native-root-siblings";
import ToastContainer from "./ToastContainer";

class Toast extends Component {
    constructor(props) {
        super(props);
        _toast = null;
    }

    static show = (message, options = { position: "top", duration: 2000 }) => {
        return new RootSiblings(
            (
                <ToastContainer {...options} visible={true}>
                    {message}
                </ToastContainer>
            )
        );
    };

    static hide = toast => {
        if (toast instanceof RootSiblings) {
            toast.destroy();
        }
    };

    componentWillMount = () => {
        this._toast = new RootSiblings(
            <ToastContainer {...this.props} duration={0} />
        );
    };

    componentWillReceiveProps = nextProps => {
        this._toast.update(<ToastContainer {...nextProps} duration={0} />);
    };

    componentWillUnmount = () => {
        this._toast.destroy();
    };
}

export { RootSiblings as Manager };
export default Toast;
