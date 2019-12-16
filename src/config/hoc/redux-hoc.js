import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import getActionsAndReducers from '../../models/redux';

//用于集成model里的方法，暂无
const {actions} = getActionsAndReducers();
//高阶函数实现对redux connect的封装
const defaultConnect = ({_actions, options}) =>{
    return function connectComponent(component) {
        const {
            mapStateToProps = () => ({}),
            mapDispatchToProps = (dispatch) => {
                
                const ac = bindActionCreators(_actions, dispatch);
                Object.keys(_actions).forEach(key => {
                    if (typeof _actions[key] === 'object') {
                        ac[key] = bindActionCreators(_actions[key], dispatch);
                    }
                });

                return {action: ac};
            },
            mergeProps,
            LayoutComponent,
        } = component;

        // 只要组件导出了mapStateToProps，就说明要与redux进行连接
        // 优先获取LayoutComponent，如果不存在，获取default
        if (mapStateToProps) {
            let com = LayoutComponent || component.default;
            if (!com) {return component;}
            return connect(
                mapStateToProps,
                mapDispatchToProps,
                mergeProps,
                options
            )(com);
        }
        return LayoutComponent || component.default || component; // 如果 component有多个导出，优先LayoutComponent，其次使用默认导出
    };
};
//mapStateToProps是中间参数
const ReduxHOC = MyConnect => (mapStateToProps = state => ({})) => (WrappedComponent) => MyConnect({mapStateToProps, LayoutComponent: WrappedComponent});


const MyConnect = defaultConnect({_actions:actions, options: {ref: true}});

const createReduxHOC = ReduxHOC(MyConnect);

export default createReduxHOC;
