import React, { Component } from 'react';
import { compose } from '../index';
import FetchHoc from './fetch-hoc';
import ReduxHoc from './redux-hoc';
import { Toast } from 'antd-mobile';

/**
 * 页面配置高阶组件，整合了多个高阶组件
 * @param options
 * @returns {function(*): WithConfig}
 */
export default (options) => {
    return WrappedComponent => {
        const {
            title = true,           // true：当前页面显示通过菜单结构自动生成的title；false：当前页面不显示title；string：自定义title，并不参与国际化；object：{local, text}，text对应国际化menu中的配置，label为国际化失败之后的默认显示；function(props): 返回值作为title
            fetch = true,
            connect = null,
        } = options;

        //console.log(options)

        let hocFuncs = [];
        //注入fetch
        if (fetch) {
            hocFuncs.push(FetchHoc);
        }

        hocFuncs.push(ReduxHoc());
        //注入connect
        if (connect) {
            hocFuncs.push(ReduxHoc(connect));
        }


        const hocs = compose(hocFuncs);

        let lastBackPressed = Date.now();

        //const componentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
        @hocs
        class WithConfig extends Component {
            constructor(...args) {
                super(...args);

                this.onBackAndroid = this.onBackAndroid.bind(this);
                console.log('hoc get', title);

            }

            onBackAndroid() {
                const { dispatch, nav } = this.props;
                console.log('nav:', nav);
                if (this.props.nav.index > 0) {
                    //触发返回动作
                    this.props.navigation.goBack();
                    return true;
                } else {
                    if (lastBackPressed && lastBackPressed + 2000 >= Date.now()) {
                        //最近2秒内按过back键，可以退出应用。
                        // BackHandler.exitApp();
                        return;
                    }
                    lastBackPressed = Date.now();
                    Toast.show('再按一次退出应用', 2);
                    return true;
                }
            }
            componentDidMount() {
                // if (Platform.OS === 'android') {
                //     BackHandler.addEventListener('hardwareBackPress', this.onBackAndroid);
                // }
            }
            componentWillUnmount() {
                // if (Platform.OS === 'android') {
                //     // this.showToast('销毁');
                //     BackHandler.removeEventListener('hardwareBackPress', this.onBackAndroid);
                // }
            }

            // 设置框架级的一些数据
            initFrame = () => {

            };

            render() {
                return (
                    <WrappedComponent
                        //onComponentWillShow={func => this.onShow = func}
                        //onComponentWillHide={func => this.onHide = func}
                        {...this.props}
                    />
                );
            }
        }

        return WithConfig;
    };
};
