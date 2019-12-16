import React, {Component} from 'react';
import { get,postJSON } from '../../utils/request';

const createFetchHoc = WrappedComponent => {
    class WithFetch extends Component {
        constructor(props) {
            super(props);
            this._$fetch = {};
            this._$fetchTokens = [];
            const methods = ['get', 'post'];

            this._$fetch.get = (...args) => {
                const fetchToken = get(...args);
                this._$fetchTokens.push(fetchToken);
                return fetchToken;
            };
            this._$fetch.post = (...args) => {
                const fetchToken = postJSON(...args);
                this._$fetchTokens.push(fetchToken);
                return fetchToken;
            };
        }

        static displayName = `WithFetch(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

        componentWillUnmount() {
            //this._$fetchTokens.forEach(item => item.reject());
        }

        render() {
            const injectProps = {
                ['fetch']: this._$fetch,
            };
            return <WrappedComponent {...injectProps} {...this.props}/>;
        }
    }

    return WithFetch;
};

export default createFetchHoc;
